package com.farmchainx.controller;

import com.farmchainx.dto.UserDTO;
import com.farmchainx.model.User;
import com.farmchainx.repository.UserRepository;
import com.farmchainx.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;

    // ── GET /api/users/profile ────────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            String email = getEmailFromAuth(auth);
            if (email == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
            return userRepository.findByEmail(email)
                    .map(u -> ResponseEntity.ok(Map.of("success", true, "data", new UserDTO(u))))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
    }

    // ── PUT /api/users/profile ────────────────────────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UserDTO req,
            @RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            String email = getEmailFromAuth(auth);
            if (email == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
            return userRepository.findByEmail(email).map(u -> {
                if (req.getName() != null) u.setName(req.getName());
                userRepository.save(u);
                return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated", "data", new UserDTO(u)));
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
    }

    // ── GET /api/users ────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<UserDTO> users = userRepository.findAll()
                .stream().map(UserDTO::new).toList();
        return ResponseEntity.ok(Map.of("success", true, "data", users));
    }

    // ── GET /api/users/role/{role} ────────────────────────────────────────────
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable User.Role role) {
        List<UserDTO> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == role)
                .map(UserDTO::new).toList();
        return ResponseEntity.ok(Map.of("success", true, "data", users));
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private String getEmailFromAuth(String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) return null;
        String token = auth.replace("Bearer ", "");
        if (!jwtUtil.validateToken(token)) return null;
        return jwtUtil.getEmailFromToken(token);
    }
}