package groceriq.controllers;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


import groceriq.models.PriceRecord;
import groceriq.models.Product;
import groceriq.models.ShoppingList;
import groceriq.services.UserService;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final UserService userService;
    private final DataSource dataSource;

    @Autowired
    public ProductController(UserService userService, DataSource dataSource) {
        this.userService = userService;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<?> productList(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
            @RequestParam(name = "chain", required = false, defaultValue = "") String chain,
            @RequestParam(name = "category", required = false, defaultValue = "") String category) {
        List<Product> products = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            String sql;
            if(chain.isEmpty()){ 
                sql = "SELECT * FROM products WHERE product_name LIKE ? AND category LIKE ? ORDER BY product_name";
            }else{
                sql = "SELECT DISTINCT p.* FROM products p " +
              "JOIN price_records pr ON p.product_id = pr.product_id " +
              "JOIN stores s ON pr.store_id = s.store_id " +
              "WHERE p.product_name LIKE ? AND p.category LIKE ? AND s.chain LIKE ? " +
              "ORDER BY p.product_name";
            }
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, "%" + search + "%");
                pstmt.setString(2, "%" + category + "%");
                if(!chain.isEmpty()){
                    pstmt.setString(3, "%" + chain + "%");
                }
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        products.add(new Product(
                            rs.getInt("product_id"),
                            rs.getString("product_name"),
                            rs.getString("category"),
                            rs.getString("brand"),
                            rs.getBigDecimal("unit_size"),
                            rs.getString("unit_type")
                        ));
                    }
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        
        List<ShoppingList> userLists = new ArrayList<>();
        String listSql = "SELECT list_id, list_name FROM shopping_lists WHERE user_id = ? AND is_active = 1";
        try(Connection conn = dataSource.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(listSql)){
                pstmt.setInt(1, Integer.parseInt(userService.getLoggedInUser().getUserId()));
                try (ResultSet rs = pstmt.executeQuery()){
                    while(rs.next()){
                        userLists.add(new ShoppingList(
                            rs.getInt("list_id"),
                            Integer.parseInt(userService.getLoggedInUser().getUserId()),
                            rs.getString("list_name"),
                            null,
                            true
                        ));
                    }
                }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }

        return ResponseEntity.ok(Map.of(
                "loggedInUser", userService.getLoggedInUser(),
                "search", search,
                "category", category,
                "chain", chain,
                "products", products,
                "userLists", userLists));
    }

    @PostMapping("/add-to-list")
    public ResponseEntity<?> addToList(@RequestBody AddToListRequest request)
    {
        if(request.productIds() == null || request.productIds().isEmpty()){
            return ResponseEntity.badRequest().body(Map.of("error", "Select at least one product."));
        }
        String sql = "INSERT INTO list_items (list_id, product_id, quantity) VALUES (?, ?, 1) " +
                     "ON DUPLICATE KEY UPDATE quantity = quantity + 1";
        try (Connection conn = dataSource.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql)){
                for (int productId : request.productIds()){
                    pstmt.setInt(1, request.listId());
                    pstmt.setInt(2, productId);
                    pstmt.executeUpdate();
                }
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.ok(Map.of("message", "Products added"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> productDetail(@PathVariable("id") int productId) {
        Product product = null;
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "SELECT * FROM products WHERE product_id = ?")) {
                pstmt.setInt(1, productId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        product = new Product(
                            rs.getInt("product_id"),
                            rs.getString("product_name"),
                            rs.getString("category"),
                            rs.getString("brand"),
                            rs.getBigDecimal("unit_size"),
                            rs.getString("unit_type")
                        );
                    }
                }
            }
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found."));
            }
            String pricesSql =
                "SELECT pr.record_id, pr.product_id, pr.store_id, s.store_name, s.chain, " +
                "pr.price, pr.reg_price, pr.is_sale, pr.price_date " +
                "FROM price_records pr JOIN stores s ON pr.store_id = s.store_id " +
                "WHERE pr.product_id = ? " +
                "AND pr.price_date = (" + 
                "   SELECT MAX(pr2.price_date) FROM price_records pr2 "  + 
                "   WHERE pr2.product_id = pr.product_id AND pr2.store_id = pr.store_id" + 
                ") " + 
                "ORDER BY pr.price_date ASC";
            List<PriceRecord> prices = new ArrayList<>();
            try (PreparedStatement pstmt = conn.prepareStatement(pricesSql)) {
                pstmt.setInt(1, productId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        prices.add(new PriceRecord(
                            rs.getInt("record_id"),
                            rs.getInt("product_id"),
                            rs.getInt("store_id"),
                            rs.getString("store_name"),
                            rs.getString("chain"),
                            rs.getBigDecimal("price"),
                            rs.getBigDecimal("reg_price"),
                            rs.getBoolean("is_sale"),
                            rs.getString("price_date")
                        ));
                    }
                }
            }
            BigDecimal weekHigh = null; 
            BigDecimal weekLow = null; 
            String statsSql = 
                "SELECT MIN(price) AS week_low, MAX(price) AS week_high " + 
                "FROM price_records " + 
                "WHERE product_id = ? " + 
                "AND price_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)"; 
            try (PreparedStatement pstmt = conn.prepareStatement(statsSql)) {
                pstmt.setInt(1, productId); 
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        weekLow = rs.getBigDecimal("week_low"); 
                        weekHigh = rs.getBigDecimal("week_high"); 
                    }
                }
            }
            List<Map<String, Object>> monthlyHistory = new ArrayList<>(); 
            String histSql = 
                "SELECT DATE_FORMAT(price_date, '%Y-%m') AS month, AVG(price) AS avg_price " + 
                "FROM price_records " + 
                "WHERE product_id = ? " + 
                "AND price_date >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH) " + 
                "GROUP BY month ORDER BY month ASC"; 
            try (PreparedStatement pstmt = conn.prepareStatement(histSql)) { 
                pstmt.setInt(1, productId); 
                try (ResultSet rs = pstmt.executeQuery()) { 
                    while (rs.next()) {
                        Map<String, Object> point = new HashMap<>(); 
                        point.put("month", rs.getString("month")); 
                        point.put("avgPrice", rs.getBigDecimal("avg_price")); 
                        monthlyHistory.add(point); 
                    }
                }
            }

            Double predictedPrice = null; 
            int n = monthlyHistory.size(); 
            if (n >= 2) { 
                double sumX = 0,  sumY = 0, sumXY = 0, sumX2 = 0; 
                for (int i = 0; i < n; i++) { 
                    double x = i; 
                    double y = ((BigDecimal) monthlyHistory.get(i).get("avgPrice")).doubleValue(); 
                    sumX += x; 
                    sumY += y; 
                    sumXY += x * y; 
                    sumX2 += x * x;
                }
                double denom = n * sumX2 - sumX * sumX; 
                if (denom != 0) { 
                    double slope        = (n * sumXY - sumX * sumY) /denom; 
                    double intercept    = (sumY - slope * sumX) / n; 
                    predictedPrice      = Math.round((slope * n + intercept) * 100.0) / 100.0; 
                }
            
                }
    

            Map<String, Object> response = new HashMap<> (); 
            response.put("loggedInUser", userService.getLoggedInUser());
            response.put("product",         product); 
            response.put("prices",          prices); 
            response.put("weekHigh",        weekHigh); 
            response.put("weekLow",         weekLow); 
            response.put("monthlyHistory",  monthlyHistory); 
            response.put("predictedPrice",  predictedPrice); 
            return ResponseEntity.ok(response); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    public record AddToListRequest(int listId, List<Integer> productIds) {}

}