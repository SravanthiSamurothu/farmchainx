package com.farmchainx.controller;

import com.farmchainx.dto.*;
import com.farmchainx.model.*;
import com.farmchainx.repository.*;
import com.farmchainx.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    // ── GET /api/orders/my ────────────────────────────────────────────────────
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('CONSUMER','RETAILER')")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetailsImpl me) {
        User consumer = userRepository.findById(me.getId()).orElseThrow();
        List<OrderDTO> orders = orderRepository.findByConsumerOrderByCreatedAtDesc(consumer)
            .stream().map(OrderDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    // ── GET /api/orders/:id ───────────────────────────────────────────────────
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CONSUMER','RETAILER')")
    public ResponseEntity<?> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl me) {
        return orderRepository.findById(id).map(o -> {
            if (!o.getConsumer().getId().equals(me.getId()))
                return ResponseEntity.status(403).body(ApiResponse.error("Not your order"));
            return ResponseEntity.ok(ApiResponse.ok(OrderDTO.from(o)));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── POST /api/orders ──────────────────────────────────────────────────────
    @PostMapping
    @PreAuthorize("hasAnyRole('CONSUMER','RETAILER')")
    public ResponseEntity<?> placeOrder(
        @Valid @RequestBody OrderRequestDTO req,
        @AuthenticationPrincipal UserDetailsImpl me
    ) {
        User consumer = userRepository.findById(me.getId()).orElseThrow();

        Order order = Order.builder()
            .orderCode("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .consumer(consumer)
            .deliveryAddress(req.getDeliveryAddress())
            .paymentMethod(req.getPaymentMethod())
            .items(new ArrayList<>())
            .totalAmount(BigDecimal.ZERO)
            .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Insufficient stock for: " + product.getName()));
            }

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem item = OrderItem.builder()
                .order(order).product(product)
                .quantity(itemReq.getQuantity())
                .unitPrice(product.getPrice())
                .subtotal(subtotal)
                .build();

            order.getItems().add(item);
            total = total.add(subtotal);

            // Deduct stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);
        }

        // Add platform fee
        total = total.add(BigDecimal.TEN);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        return ResponseEntity.status(201).body(ApiResponse.ok("Order placed successfully", OrderDTO.from(saved)));
    }

    // ── PATCH /api/orders/:id/status  (retailer can update) ──────────────────
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RETAILER')")
    public ResponseEntity<?> updateStatus(
        @PathVariable Long id,
        @RequestParam Order.OrderStatus status
    ) {
        return orderRepository.findById(id).map(o -> {
            o.setStatus(status);
            return ResponseEntity.ok(ApiResponse.ok("Order status updated", OrderDTO.from(orderRepository.save(o))));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── GET /api/orders/retailer/all  (retailer sees all orders) ─────────────
    @GetMapping("/retailer/all")
    @PreAuthorize("hasRole('RETAILER')")
    public ResponseEntity<?> getAllOrders() {
        List<OrderDTO> orders = orderRepository.findAll()
            .stream().map(OrderDTO::from).toList();
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }
}