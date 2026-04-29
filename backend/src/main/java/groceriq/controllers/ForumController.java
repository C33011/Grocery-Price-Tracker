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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import groceriq.models.ForumPost;
import groceriq.services.UserService;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final UserService userService;
    private final DataSource dataSource;

    @Autowired
    public ForumController(UserService userService, DataSource dataSource) {
        this.userService = userService;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<?> forumPage() {
        List<ForumPost> posts = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                        "SELECT p.post_id, p.user_id, u.username, p.title, p.body, p.posted_at " +
                        "FROM posts p JOIN users u ON p.user_id = u.user_id " +
                        "ORDER BY p.posted_at DESC")) {
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    posts.add(new ForumPost(
                        rs.getInt("post_id"),
                        rs.getInt("user_id"),
                        rs.getString("username"),
                        rs.getString("title"),
                        rs.getString("body"),
                        rs.getString("posted_at")
                    ));
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.ok(Map.of(
                "loggedInUser", userService.getLoggedInUser(),
                "posts", posts));
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody CreatePostRequest request) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                        "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)")) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, request.title());
            pstmt.setString(3, request.body());
            pstmt.executeUpdate();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Post created"));
    }

    public record CreatePostRequest(String title, String body) {}
}
