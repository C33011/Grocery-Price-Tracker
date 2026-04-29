package groceriq.controllers;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import groceriq.services.UserService;

@RestController
@RequestMapping("/api/auth")
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.password() == null || request.password().trim().length() < 3) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 3 characters."));
        }
        if (!request.password().equals(request.passwordRepeat())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Passwords do not match."));
        }
        try {
            boolean success = userService.registerUser(
                    request.username(),
                    request.email(),
                    request.password(),
                    request.firstName(),
                    request.lastName());
            if (success) {
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Registered"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Registration failed. Please try again."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    public record RegisterRequest(
            String username,
            String email,
            String password,
            String passwordRepeat,
            String firstName,
            String lastName) {}
}
