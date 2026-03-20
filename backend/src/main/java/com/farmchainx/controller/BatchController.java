package com.farmchainx.controller;

import com.farmchainx.dto.*;
import com.farmchainx.model.Batch;
import com.farmchainx.model.Product;
import com.farmchainx.model.User;
import com.farmchainx.repository.BatchRepository;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    @Autowired private BatchRepository batchRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    // ── GET /api/batches/my  (farmer) ────────────────────────────────────────
    @GetMapping("/my")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> getMyBatches(@AuthenticationPrincipal UserDetailsImpl me) {
        User farmer = userRepository.findById(me.getId()).orElseThrow();
        List<BatchDTO> batches = batchRepository.findByFarmerOrderByCreatedAtDesc(farmer)
            .stream().map(BatchDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(batches));
    }

    // ── GET /api/batches/trace/:code  (public QR trace) ──────────────────────
    @GetMapping("/trace/{code}")
    public ResponseEntity<?> trace(@PathVariable String code) {
        return batchRepository.findByBatchCode(code)
            .map(b -> ResponseEntity.ok(ApiResponse.ok(BatchDTO.from(b))))
            .orElse(ResponseEntity.notFound().build());
    }

    // ── GET /api/batches/:id ──────────────────────────────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl me) {
        return batchRepository.findById(id).map(b -> {
            if (!b.getFarmer().getId().equals(me.getId()))
                return ResponseEntity.status(403).body(ApiResponse.error("Not your batch"));
            return ResponseEntity.ok(ApiResponse.ok(BatchDTO.from(b)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── POST /api/batches  (farmer) ───────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> create(
        @Valid @RequestBody BatchRequestDTO req,
        @AuthenticationPrincipal UserDetailsImpl me
    ) {
        User farmer = userRepository.findById(me.getId()).orElseThrow();
        Product product = productRepository.findById(req.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        String batchCode = "BCH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Batch batch = Batch.builder()
            .batchCode(batchCode).product(product).farmer(farmer)
            .quantity(req.getQuantity()).price(req.getPrice())
            .harvestDate(req.getHarvestDate()).expiryDate(req.getExpiryDate())
            .farmLocation(req.getFarmLocation())
            .certified(req.getCertified() != null && req.getCertified())
            .build();

        Batch saved = batchRepository.save(batch);
        return ResponseEntity.status(201).body(ApiResponse.ok("Batch created", BatchDTO.from(saved)));
    }

    // ── PATCH /api/batches/:id/status  (farmer) ───────────────────────────────
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> updateStatus(
        @PathVariable Long id,
        @RequestParam Batch.BatchStatus status,
        @AuthenticationPrincipal UserDetailsImpl me
    ) {
        return batchRepository.findById(id).map(b -> {
            if (!b.getFarmer().getId().equals(me.getId()))
                return ResponseEntity.status(403).body(ApiResponse.error("Not your batch"));
            b.setStatus(status);
            return ResponseEntity.ok(ApiResponse.ok("Status updated", BatchDTO.from(batchRepository.save(b))));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── GET /api/batches/stats  (farmer analytics) ────────────────────────────
    @GetMapping("/stats")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> stats(@AuthenticationPrincipal UserDetailsImpl me) {
        User farmer = userRepository.findById(me.getId()).orElseThrow();
        List<Batch> batches = batchRepository.findByFarmer(farmer);
        long total = batches.size();
        long delivered = batches.stream().filter(b -> b.getStatus() == Batch.BatchStatus.DELIVERED).count();
        long inTransit = batches.stream().filter(b -> b.getStatus() == Batch.BatchStatus.IN_TRANSIT).count();
        java.math.BigDecimal revenue = batches.stream()
            .map(Batch::getPrice)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return ResponseEntity.ok(ApiResponse.ok(new java.util.HashMap<String, Object>() {{
            put("totalBatches", total);
            put("delivered", delivered);
            put("inTransit", inTransit);
            put("totalRevenue", revenue);
        }}));
    }
}