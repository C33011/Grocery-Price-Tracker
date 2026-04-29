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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import groceriq.models.PriceAlert;
import groceriq.models.Product;
import groceriq.services.UserService;

@Controller
@RequestMapping("/")
public class DashboardController {

    private final UserService userService;
    private final DataSource dataSource;

    @Autowired
    public DashboardController(UserService userService, DataSource dataSource) {
        this.userService = userService;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ModelAndView webpage() {
        ModelAndView mv = new ModelAndView("dashboard");
        mv.addObject("loggedInUser", userService.getLoggedInUser());
        
        //Featured Products
        List<Product> featuredProducts = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                        "SELECT * FROM products ORDER BY product_id LIMIT 10")) {
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    featuredProducts.add(new Product(
                        rs.getInt("product_id"),
                        rs.getString("product_name"),
                        rs.getString("category"),
                        rs.getString("brand"),
                        rs.getBigDecimal("unit_size"),
                        rs.getString("unit_type")
                    ));
                }
            }
        } catch (Exception e) {
            mv.addObject("errorMessage", e.getMessage());
        }
        mv.addObject("featuredProducts", featuredProducts);

        //Price Alerts
        List<PriceAlert> priceAlerts = new ArrayList<>();
        String alertSql =
            "SELECT p.product_id, p.product_name, p.brand, p.category, " +
            "s.store_name, s.chain, current_price.price AS current_price, " +
            "ROUND(avg_price.avg_price, 2) AS avg_price, " +
            "ROUND(((avg_price.avg_price - current_price.price) / avg_price.avg_price) * 100, 1) AS pct_below_avg " +
            "FROM products p " +
            "JOIN ( " +
            "    SELECT pr1.product_id, pr1.store_id, pr1.price " +
            "    FROM price_records pr1 " +
            "    INNER JOIN ( " +
            "        SELECT product_id, store_id, MAX(price_date) AS max_date " +
            "        FROM price_records " +
            "        GROUP BY product_id, store_id " +
            "    ) latest ON pr1.product_id = latest.product_id " +
            "            AND pr1.store_id = latest.store_id " +
            "            AND pr1.price_date = latest.max_date " +
            ") current_price ON p.product_id = current_price.product_id " +
            "JOIN stores s ON current_price.store_id = s.store_id " +
            "JOIN ( " +
            "    SELECT product_id, store_id, AVG(price) AS avg_price " +
            "    FROM price_records " +
            "    WHERE price_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) " +
            "    GROUP BY product_id, store_id " +
            ") avg_price ON p.product_id = avg_price.product_id " +
            "          AND current_price.store_id = avg_price.store_id " +
            "WHERE current_price.price < avg_price.avg_price " +
            "ORDER BY pct_below_avg DESC " +
            "LIMIT 10";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(alertSql)) {
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    priceAlerts.add(new PriceAlert(
                        rs.getInt("product_id"),
                        rs.getString("product_name"),
                        rs.getString("brand"),
                        rs.getString("category"),
                        rs.getString("store_name"),
                        rs.getString("chain"),
                        rs.getBigDecimal("current_price"),
                        rs.getBigDecimal("avg_price"),
                        rs.getDouble("pct_below_avg")
                    ));
                }
            }
        } catch (Exception e) {
            mv.addObject("errorMessage", e.getMessage());
        }
        mv.addObject("priceAlerts", priceAlerts);

        return mv;
    }
}
