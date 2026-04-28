package groceriq.controllers;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import groceriq.models.ForumPost;
import groceriq.services.UserService;

@Controller
@RequestMapping("/forum")
public class ForumController {

    private final UserService userService;
    private final DataSource dataSource;

    @Autowired
    public ForumController(UserService userService, DataSource dataSource) {
        this.userService = userService;
        this.dataSource = dataSource;
    }

    @GetMapping
    public ModelAndView forumPage(@RequestParam(name = "error", required = false) String error) {
        ModelAndView mv = new ModelAndView("forum");
        mv.addObject("loggedInUser", userService.getLoggedInUser());
        mv.addObject("errorMessage", error);
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
            mv.addObject("errorMessage", e.getMessage());
        }
        mv.addObject("posts", posts);
        return mv;
    }

    @PostMapping("/create")
    public String createPost(@RequestParam("title") String title,
            @RequestParam("body") String body) {
        int userId = Integer.parseInt(userService.getLoggedInUser().getUserId());
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(
                        "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)")) {
            pstmt.setInt(1, userId);
            pstmt.setString(2, title);
            pstmt.setString(3, body);
            pstmt.executeUpdate();
        } catch (Exception e) {
            String message = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            return "redirect:/forum?error=" + message;
        }
        return "redirect:/forum";
    }
}
