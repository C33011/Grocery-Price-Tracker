package uga.menik.csx370.controllers;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import uga.menik.csx370.models.ListItem;
import uga.menik.csx370.models.Product;
import uga.menik.csx370.models.ShoppingList;
import uga.menik.csx370.services.UserService;

@Controller
@RequestMapping("/lists")
public class ListController {

    private final UserService userService;
    private final DataSource dataSource;

    @Autowired
    public ListController(UserService userService, DataSource dataSource) {
        this.userService = userService;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ModelAndView listsPage() {
        ModelAndView mv = new ModelAndView("lists");
        mv.addObject("loggedInUser", userService.getLoggedInUser());
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        List<ShoppingList> lists = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                        "SELECT * FROM shopping_lists WHERE user_id = ? ORDER BY created_at DESC")) {
            pstmt.setInt(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    lists.add(new ShoppingList(
                        rs.getInt("list_id"),
                        rs.getInt("user_id"),
                        rs.getString("list_name"),
                        rs.getString("created_at"),
                        rs.getBoolean("is_active")
                    ));
                }
            }
        } catch (Exception e) {
            mv.addObject("errorMessage", e.getMessage());
        }
        mv.addObject("lists", lists);
        return mv;
    }

    @PostMapping("/create")
    public String createList(@RequestParam("listName") String listName) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                        "INSERT INTO shopping_lists (user_id, list_name) VALUES (?, ?)")) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, listName);
            pstmt.executeUpdate();
        } catch (Exception e) {
            String message = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            return "redirect:/lists?error=" + message;
        }
        return "redirect:/lists";
    }

    @GetMapping("/{id}")
    public ModelAndView listDetail(@PathVariable("id") int listId) {
        ModelAndView mv = new ModelAndView("list_detail");
        mv.addObject("loggedInUser", userService.getLoggedInUser());
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "SELECT * FROM shopping_lists WHERE list_id = ? AND user_id = ?")) {
                pstmt.setInt(1, listId);
                pstmt.setInt(2, userId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        mv.addObject("list", new ShoppingList(
                            rs.getInt("list_id"),
                            rs.getInt("user_id"),
                            rs.getString("list_name"),
                            rs.getString("created_at"),
                            rs.getBoolean("is_active")
                        ));
                    } else {
                        return new ModelAndView("redirect:/lists");
                    }
                }
            }
            List<ListItem> items = new ArrayList<>();
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "SELECT li.item_id, li.list_id, li.product_id, p.product_name, li.quantity, li.checked " +
                    "FROM list_items li JOIN products p ON li.product_id = p.product_id " +
                    "WHERE li.list_id = ?")) {
                pstmt.setInt(1, listId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        items.add(new ListItem(
                            rs.getInt("item_id"),
                            rs.getInt("list_id"),
                            rs.getInt("product_id"),
                            rs.getString("product_name"),
                            rs.getInt("quantity"),
                            rs.getBoolean("checked")
                        ));
                    }
                }
            }
            mv.addObject("items", items);
            List<Product> allProducts = new ArrayList<>();
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "SELECT product_id, product_name FROM products ORDER BY product_name")) {
                try (ResultSet rs = pstmt.executeQuery()) {
                    while (rs.next()) {
                        allProducts.add(new Product(
                            rs.getInt("product_id"),
                            rs.getString("product_name"),
                            "", null, null, null
                        ));
                    }
                }
            }
            mv.addObject("allProducts", allProducts);
            mv.addObject("listId", listId);
        } catch (Exception e) {
            mv.addObject("errorMessage", e.getMessage());
        }
        return mv;
    }

    @PostMapping("/{id}/add")
    public String addItem(@PathVariable("id") int listId,
            @RequestParam("productId") int productId,
            @RequestParam(name = "quantity", defaultValue = "1") int quantity) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement check = conn.prepareStatement(
                    "SELECT list_id FROM shopping_lists WHERE list_id = ? AND user_id = ?")) {
                check.setInt(1, listId);
                check.setInt(2, userId);
                try (ResultSet rs = check.executeQuery()) {
                    if (!rs.next()) return "redirect:/lists";
                }
            }
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "INSERT INTO list_items (list_id, product_id, quantity) VALUES (?, ?, ?)")) {
                pstmt.setInt(1, listId);
                pstmt.setInt(2, productId);
                pstmt.setInt(3, quantity);
                pstmt.executeUpdate();
            }
        } catch (Exception e) {
            String message = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            return "redirect:/lists/" + listId + "?error=" + message;
        }
        return "redirect:/lists/" + listId;
    }

    @PostMapping("/{id}/remove")
    public String removeItem(@PathVariable("id") int listId,
            @RequestParam("itemId") int itemId) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "DELETE li FROM list_items li " +
                    "JOIN shopping_lists sl ON li.list_id = sl.list_id " +
                    "WHERE li.item_id = ? AND sl.list_id = ? AND sl.user_id = ?")) {
                pstmt.setInt(1, itemId);
                pstmt.setInt(2, listId);
                pstmt.setInt(3, userId);
                pstmt.executeUpdate();
            }
        } catch (Exception e) {
            String message = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            return "redirect:/lists/" + listId + "?error=" + message;
        }
        return "redirect:/lists/" + listId;
    }

    @PostMapping("/{id}/check")
    public String checkItem(@PathVariable("id") int listId,
            @RequestParam("itemId") int itemId,
            @RequestParam("checked") boolean checked) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "UPDATE list_items li " +
                    "JOIN shopping_lists sl ON li.list_id = sl.list_id " +
                    "SET li.checked = ? " +
                    "WHERE li.item_id = ? AND sl.list_id = ? AND sl.user_id = ?")) {
                pstmt.setBoolean(1, checked);
                pstmt.setInt(2, itemId);
                pstmt.setInt(3, listId);
                pstmt.setInt(4, userId);
                pstmt.executeUpdate();
            }
        } catch (Exception e) {
            String message = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            return "redirect:/lists/" + listId + "?error=" + message;
        }
        return "redirect:/lists/" + listId;
    }
}
