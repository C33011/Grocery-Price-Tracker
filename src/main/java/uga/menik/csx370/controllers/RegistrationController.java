package uga.menik.csx370.controllers;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import uga.menik.csx370.services.UserService;

@Controller
@RequestMapping("/register")
public class RegistrationController {

    private final UserService userService;

    @Autowired
    public RegistrationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ModelAndView webpage(@RequestParam(name = "error", required = false) String error) {
        ModelAndView mv = new ModelAndView("register_page");
        mv.addObject("errorMessage", error);
        return mv;
    }

    @PostMapping
    public String register(@RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("passwordRepeat") String passwordRepeat,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName) {
        if (password.trim().length() < 3) {
            String message = URLEncoder.encode("Password must be at least 3 characters.",
                    StandardCharsets.UTF_8);
            return "redirect:/register?error=" + message;
        }
        if (!password.equals(passwordRepeat)) {
            String message = URLEncoder.encode("Passwords do not match.", StandardCharsets.UTF_8);
            return "redirect:/register?error=" + message;
        }
        try {
            boolean success = userService.registerUser(username, email, password, firstName, lastName);
            if (success) {
                return "redirect:/login";
            } else {
                String message = URLEncoder.encode("Registration failed. Please try again.",
                        StandardCharsets.UTF_8);
                return "redirect:/register?error=" + message;
            }
        } catch (Exception e) {
            String message = URLEncoder.encode("Error: " + e.getMessage(), StandardCharsets.UTF_8);
            return "redirect:/register?error=" + message;
        }
    }
}
