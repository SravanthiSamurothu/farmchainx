package com.farmchainx.controller;
import com.farmchainx.model.User;
import com.farmchainx.repository.UserRepository;
import com.farmchainx.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private BCryptPasswordEncoder passwordEncoder;

    // ─── REGISTER ───────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");
        String roleStr = body.get("role");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false, "message", "Email already registered"
            ));
        }

        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password)); // ✅ hashed
        user.setRole(User.Role.valueOf(roleStr.toUpperCase()));
        userRepository.save(user); // ✅ saved to MySQL

        String token = jwtUtil.generateToken(email);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Registration successful",
            "data", Map.of(
                "token", token,
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "id", user.getId()
            )
        ));
    }

    // ─── LOGIN ──────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false, "message", "Email not found"
            ));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false, "message", "Incorrect password"
            ));
        }

        String token = jwtUtil.generateToken(email); // ✅ real JWT

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Login Success",
            "data", Map.of(
                "token", token,
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "id", user.getId()
            )
        ));
    }

    // ─── GET CURRENT USER ────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value="Authorization", required=false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        try {
            String token = auth.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);
            User user = userRepository.findByEmail(email).orElseThrow();
            return ResponseEntity.ok(Map.of("data", Map.of(
                "name", user.getName(), "role", user.getRole().name(),
                "email", user.getEmail(), "id", user.getId()
            )));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
        }
    }
}