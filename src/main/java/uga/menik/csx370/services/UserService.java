package uga.menik.csx370.services;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import uga.menik.csx370.models.User;

@Service
@SessionScope
public class UserService {

    private final DataSource dataSource;
    private final BCryptPasswordEncoder passwordEncoder;
    private User loggedInUser = null;

    @Autowired
    public UserService(DataSource dataSource) {
        this.dataSource = dataSource;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public boolean authenticate(String username, String password) throws SQLException {
        final String sql = "SELECT * FROM users WHERE username = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String storedHash = rs.getString("password_hash");
                    boolean match = passwordEncoder.matches(password, storedHash);
                    if (match) {
                        loggedInUser = new User(
                            rs.getString("user_id"),
                            rs.getString("username"),
                            rs.getString("firstName"),
                            rs.getString("lastName")
                        );
                    }
                    return match;
                }
            }
        }
        return false;
    }

    public void unAuthenticate() {
        loggedInUser = null;
    }

    public boolean isAuthenticated() {
        return loggedInUser != null;
    }

    public User getLoggedInUser() {
        return loggedInUser;
    }

    public boolean registerUser(String username, String email, String password,
            String firstName, String lastName) throws SQLException {
        final String sql = "INSERT INTO users (username, email, password_hash, firstName, lastName) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, email);
            pstmt.setString(3, passwordEncoder.encode(password));
            pstmt.setString(4, firstName);
            pstmt.setString(5, lastName);
            int rows = pstmt.executeUpdate();
            return rows > 0;
        }
    }
}
