package uga.menik.csx370.controllers;

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

import uga.menik.csx370.models.Product;
import uga.menik.csx370.services.UserService;

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
        return mv;
    }
}
