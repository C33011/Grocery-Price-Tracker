package groceriq.controllers;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import groceriq.services.UserService;

@Controller
@RequestMapping("/login")
public class LoginController {

    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ModelAndView webpage(@RequestParam(name = "error", required = false) String error) {
        ModelAndView mv = new ModelAndView("login_page");
        userService.unAuthenticate();
        mv.addObject("errorMessage", error);
        return mv;
    }

    @PostMapping
    public String login(@RequestParam("username") String username,
            @RequestParam("password") String password) {
        boolean isAuthenticated = false;
        try {
            isAuthenticated = userService.authenticate(username, password);
        } catch (SQLException e) {
            String message = URLEncoder.encode("Authentication failed. Please try again.",
                    StandardCharsets.UTF_8);
            return "redirect:/login?error=" + message;
        }
        if (isAuthenticated) {
            return "redirect:/";
        } else {
            String message = URLEncoder.encode("Invalid username or password.",
                    StandardCharsets.UTF_8);
            return "redirect:/login?error=" + message;
        }
    }
}
