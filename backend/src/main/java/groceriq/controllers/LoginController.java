package groceriq.controllers;

import java.sql.SQLException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import groceriq.services.UserService;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> currentUser() {
        return ResponseEntity.ok(Map.of("user", userService.getLoggedInUser()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("user", userService.getLoggedInUser()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean isAuthenticated = false;
        try {
            isAuthenticated = userService.authenticate(request.username(), request.password());
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication failed. Please try again."));
        }
        if (isAuthenticated) {
            return ResponseEntity.ok(Map.of("user", userService.getLoggedInUser()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username or password."));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        userService.unAuthenticate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    public record LoginRequest(String username, String password) {}
}
