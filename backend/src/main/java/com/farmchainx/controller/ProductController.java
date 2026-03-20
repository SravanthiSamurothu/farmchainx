package com.farmchainx.controller;

import com.farmchainx.dto.*;
import com.farmchainx.model.Product;
import com.farmchainx.model.User;
import com.farmchainx.repository.ProductRepository;
import com.farmchainx.repository.UserRepository;
import com.farmchainx.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    // ── GET /api/products  (public) ──────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAll(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String search
    ) {
        List<ProductDTO> products = productRepository
            .searchProducts(category, search)
            .stream().map(ProductDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    // ── GET /api/products/:id  (public) ──────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(p -> ResponseEntity.ok(ApiResponse.ok(ProductDTO.from(p))))
            .orElse(ResponseEntity.notFound().build());
    }

    // ── GET /api/products/my  (farmer only) ──────────────────────────────────
    @GetMapping("/my")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> getMyProducts(@AuthenticationPrincipal UserDetailsImpl me) {
        User farmer = userRepository.findById(me.getId()).orElseThrow();
        List<ProductDTO> products = productRepository.findByFarmer(farmer)
            .stream().map(ProductDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    // ── POST /api/products  (farmer only) ────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> create(
        @Valid @RequestBody ProductRequestDTO req,
        @AuthenticationPrincipal UserDetailsImpl me
    ) {
        User farmer = userRepository.findById(me.getId()).orElseThrow();
        Product product = Product.builder()
            .name(req.getName()).description(req.getDescription())
            .price(req.getPrice()).unit(req.getUnit()).icon(req.getIcon())
            .category(req.getCategory()).origin(req.getOrigin())
            .stock(req.getStock() != null ? req.getStock() : 0)
            .certified(req.getCertified() != null && req.getCertified())
            .farmer(farmer)
            .build();
        Product saved = productRepository.save(product);
        return ResponseEntity.status(201).body(ApiResponse.ok("Product created", ProductDTO.from(saved)));
    }

    // ── PUT /api/products/:id  (farmer only) ─────────────────────────────────
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> update(
        @PathVariable Long id,
        @Valid @RequestBody ProductRequestDTO req,
        @AuthenticationPrincipal UserDetailsImpl me
    ) {
        return productRepository.findById(id).map(p -> {
            if (!p.getFarmer().getId().equals(me.getId()))
                return ResponseEntity.status(403).body(ApiResponse.error("Not your product"));
            p.setName(req.getName()); p.setDescription(req.getDescription());
            p.setPrice(req.getPrice()); p.setUnit(req.getUnit());
            p.setCategory(req.getCategory()); p.setOrigin(req.getOrigin());
            if (req.getStock() != null) p.setStock(req.getStock());
            if (req.getCertified() != null) p.setCertified(req.getCertified());
            return ResponseEntity.ok(ApiResponse.ok("Product updated", ProductDTO.from(productRepository.save(p))));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE /api/products/:id  (farmer only) ───────────────────────────────
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl me) {
        return productRepository.findById(id).map(p -> {
            if (!p.getFarmer().getId().equals(me.getId()))
                return ResponseEntity.status(403).body(ApiResponse.error("Not your product"));
            productRepository.delete(p);
            return ResponseEntity.ok(ApiResponse.ok("Product deleted", null));
        }).orElse(ResponseEntity.notFound().build());
    }
}