package groceriq.controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import groceriq.models.PriceRecord;
import groceriq.models.Product;
import groceriq.services.UserService;

@Controller
@RequestMapping("/products")
public class ProductController {

    private final UserService userService;
    private final DataSource dataSource;

    @Autowired
    public ProductController(UserService userService, DataSource dataSource) {
        this.userService = userService;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ModelAndView productList(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
            @RequestParam(name = "category", required = false, defaultValue = "") String category) {
        ModelAndView mv = new ModelAndView("products");
        mv.addObject("loggedInUser", userService.getLoggedInUser());
        mv.addObject("search", search);
        mv.addObject("category", category);
        List<Product> products = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            String sql = "SELECT * FROM products WHERE product_name LIKE ? AND category LIKE ? ORDER BY product_name";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, "%" + search + "%");
                pstmt.setString(2, "%" + category + "%");
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
            mv.addObject("errorMessage", e.getMessage());
        }
        mv.addObject("products", products);
        return mv;
    }

    @GetMapping("/{id}")
    public ModelAndView productDetail(@PathVariable("id") int productId) {
        ModelAndView mv = new ModelAndView("product_detail");
        mv.addObject("loggedInUser", userService.getLoggedInUser());
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "SELECT * FROM products WHERE product_id = ?")) {
                pstmt.setInt(1, productId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        mv.addObject("product", new Product(
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
            String pricesSql =
                "SELECT pr.record_id, pr.product_id, pr.store_id, s.store_name, s.chain, " +
                "pr.price, pr.reg_price, pr.is_sale, pr.price_date " +
                "FROM price_records pr JOIN stores s ON pr.store_id = s.store_id " +
                "WHERE pr.product_id = ? " +
                "ORDER BY pr.price_date DESC LIMIT 20";
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
            mv.addObject("prices", prices);
        } catch (Exception e) {
            mv.addObject("errorMessage", e.getMessage());
        }
        return mv;
    }
}
