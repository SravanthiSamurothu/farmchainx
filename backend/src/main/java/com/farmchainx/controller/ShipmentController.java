package com.farmchainx.controller;

import com.farmchainx.dto.*;
import com.farmchainx.model.Batch;
import com.farmchainx.model.Shipment;
import com.farmchainx.model.User;
import com.farmchainx.repository.BatchRepository;
import com.farmchainx.repository.ShipmentRepository;
import com.farmchainx.repository.UserRepository;
import com.farmchainx.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/shipments")
@PreAuthorize("hasRole('DISTRIBUTOR')")
public class ShipmentController {

    @Autowired private ShipmentRepository shipmentRepository;
    @Autowired private BatchRepository batchRepository;
    @Autowired private UserRepository userRepository;

    // ── GET /api/shipments/my ─────────────────────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<?> getMyShipments(@AuthenticationPrincipal UserDetailsImpl me) {
        User distributor = userRepository.findById(me.getId()).orElseThrow();
        List<ShipmentDTO> shipments = shipmentRepository
            .findByDistributorOrderByCreatedAtDesc(distributor)
            .stream().map(ShipmentDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(shipments));
    }

    // ── GET /api/shipments/:id ────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl me) {
        return shipmentRepository.findById(id).map(s -> {
            if (!s.getDistributor().getId().equals(me.getId()))
                return ResponseEntity.status(403).body(ApiResponse.error("Not your shipment"));
            return ResponseEntity.ok(ApiResponse.ok(ShipmentDTO.from(s)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── POST /api/shipments ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> create(
        @Valid @RequestBody ShipmentRequestDTO req,
        @AuthenticationPrincipal UserDetailsImpl me
    ) {
        User distributor = userRepository.findById(me.getId()).orElseThrow();
        Batch batch = batchRepository.findById(req.getBatchId())
            .orElseThrow(() -> new RuntimeException("Batch not found"));

        String shipmentCode = "SHP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Shipment shipment = Shipment.builder()
            .shipmentCode(shipmentCode).batch(batch).distributor(distributor)
            .fromLocation(req.getFromLocation()).toLocation(req.getToLocation())
            .weight(req.getWeight()).eta(req.getEta())
            .build();

        // Update batch status to IN_TRANSIT
        batch.setStatus(Batch.BatchStatus.IN_TRANSIT);
        batchRepository.save(batch);

        Shipment saved = shipmentRepository.save(shipment);
        return ResponseEntity.status(201).body(ApiResponse.ok("Shipment created", ShipmentDTO.from(saved)));
    }

    // ── PATCH /api/shipments/:id/status ──────────────────────────────────────
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
        @PathVariable Long id,
        @RequestParam Shipment.ShipmentStatus status,
        @AuthenticationPrincipal UserDetailsImpl me
    ) {
        return shipmentRepository.findById(id).map(s -> {
            if (!s.getDistributor().getId().equals(me.getId()))
                return ResponseEntity.status(403).body(ApiResponse.error("Not your shipment"));
            s.setStatus(status);

            // Sync batch status on delivery
            if (status == Shipment.ShipmentStatus.DELIVERED) {
                Batch batch = s.getBatch();
                batch.setStatus(Batch.BatchStatus.DELIVERED);
                batchRepository.save(batch);
            }

            return ResponseEntity.ok(ApiResponse.ok("Status updated", ShipmentDTO.from(shipmentRepository.save(s))));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── GET /api/shipments/stats ──────────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<?> stats(@AuthenticationPrincipal UserDetailsImpl me) {
        User distributor = userRepository.findById(me.getId()).orElseThrow();
        long active = shipmentRepository.countByDistributorAndStatus(distributor, Shipment.ShipmentStatus.IN_TRANSIT);
        long delivered = shipmentRepository.countByDistributorAndStatus(distributor, Shipment.ShipmentStatus.DELIVERED);
        long total = shipmentRepository.findByDistributor(distributor).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("active", active);
        stats.put("delivered", delivered);
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}