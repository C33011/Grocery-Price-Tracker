package groceriq.controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import groceriq.models.ListItem;
import groceriq.models.Product;
import groceriq.models.ShoppingList;
import groceriq.services.UserService;

@RestController
@RequestMapping("/api/lists")
public class ListController {

    private final UserService userService;
    private final DataSource dataSource;

    @Autowired
    public ListController(UserService userService, DataSource dataSource) {
        this.userService = userService;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<?> listsPage() {
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.ok(Map.of(
                "loggedInUser", userService.getLoggedInUser(),
                "lists", lists));
    }

    @PostMapping
    public ResponseEntity<?> createList(@RequestBody CreateListRequest request) {
        if(request.listName() == null || request.listName().trim().isEmpty()){
            return ResponseEntity.badRequest().body(Map.of("error", "List name cannot be empty."));
        }
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                        "INSERT INTO shopping_lists (user_id, list_name) VALUES (?, ?)")) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, request.listName());
            pstmt.executeUpdate();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "List created"));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<?> archiveList(@PathVariable("id") int listId){
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                    "UPDATE shopping_lists SET is_active = 0 WHERE list_id = ? AND user_id = ?")){
            pstmt.setInt(1, listId);
            pstmt.setInt(2, userId);
            pstmt.executeUpdate();
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.ok(Map.of("message", "List archived"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listDetail(@PathVariable("id") int listId) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection()) {
            ShoppingList list = null;
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "SELECT * FROM shopping_lists WHERE list_id = ? AND user_id = ?")) {
                pstmt.setInt(1, listId);
                pstmt.setInt(2, userId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        list = new ShoppingList(
                            rs.getInt("list_id"),
                            rs.getInt("user_id"),
                            rs.getString("list_name"),
                            rs.getString("created_at"),
                            rs.getBoolean("is_active")
                        );
                    }
                }
            }
            if (list == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "List not found."));
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
            return ResponseEntity.ok(Map.of(
                    "loggedInUser", userService.getLoggedInUser(),
                    "list", list,
                    "items", items,
                    "allProducts", allProducts,
                    "listId", listId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<?> addItem(@PathVariable("id") int listId,
            @RequestBody AddItemRequest request) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement check = conn.prepareStatement(
                    "SELECT list_id FROM shopping_lists WHERE list_id = ? AND user_id = ?")) {
                check.setInt(1, listId);
                check.setInt(2, userId);
                try (ResultSet rs = check.executeQuery()) {
                    if (!rs.next()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "List not found."));
                    }
                }
            }
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "INSERT INTO list_items (list_id, product_id, quantity) VALUES (?, ?, ?)")) {
                pstmt.setInt(1, listId);
                pstmt.setInt(2, request.productId());
                pstmt.setInt(3, Math.max(request.quantity(), 1));
                pstmt.executeUpdate();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Item added"));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable("id") int listId,
            @PathVariable("itemId") int itemId) {
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.ok(Map.of("message", "Item removed"));
    }

    @PatchMapping("/{id}/items/{itemId}/checked")
    public ResponseEntity<?> checkItem(@PathVariable("id") int listId,
            @PathVariable("itemId") int itemId,
            @RequestBody CheckedRequest request) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection()) {
            try (PreparedStatement pstmt = conn.prepareStatement(
                    "UPDATE list_items li " +
                    "JOIN shopping_lists sl ON li.list_id = sl.list_id " +
                    "SET li.checked = ? " +
                    "WHERE li.item_id = ? AND sl.list_id = ? AND sl.user_id = ?")) {
                pstmt.setBoolean(1, request.checked());
                pstmt.setInt(2, itemId);
                pstmt.setInt(3, listId);
                pstmt.setInt(4, userId);
                pstmt.executeUpdate();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.ok(Map.of("message", "Item updated"));
    }

    public record CreateListRequest(String listName) {}
    public record AddItemRequest(int productId, int quantity) {}
    public record CheckedRequest(boolean checked) {}
}
