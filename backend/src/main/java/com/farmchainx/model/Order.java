package com.farmchainx.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", unique = true, nullable = false)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consumer_id", nullable = false)
    private User consumer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum OrderStatus { PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED }

    // ── Constructors ──────────────────────────────────────────────────────────
    public Order() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public String getOrderCode() { return orderCode; }
    public User getConsumer() { return consumer; }
    public List<OrderItem> getItems() { return items; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String getPaymentMethod() { return paymentMethod; }
    public OrderStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public void setConsumer(User consumer) { this.consumer = consumer; }
    public void setItems(List<OrderItem> items) { this.items = items; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Order o = new Order();
        public Builder orderCode(String v) { o.orderCode = v; return this; }
        public Builder consumer(User v) { o.consumer = v; return this; }
        public Builder items(List<OrderItem> v) { o.items = v; return this; }
        public Builder totalAmount(BigDecimal v) { o.totalAmount = v; return this; }
        public Builder deliveryAddress(String v) { o.deliveryAddress = v; return this; }
        public Builder paymentMethod(String v) { o.paymentMethod = v; return this; }
        public Builder status(OrderStatus v) { o.status = v; return this; }
        public Order build() { return o; }
    }
}