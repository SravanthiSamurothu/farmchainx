package com.farmchainx.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    // ── Constructors ──────────────────────────────────────────────────────────
    public OrderItem() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public Product getProduct() { return product; }
    public Integer getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getSubtotal() { return subtotal; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setOrder(Order order) { this.order = order; }
    public void setProduct(Product product) { this.product = product; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final OrderItem item = new OrderItem();
        public Builder order(Order v) { item.order = v; return this; }
        public Builder product(Product v) { item.product = v; return this; }
        public Builder quantity(Integer v) { item.quantity = v; return this; }
        public Builder unitPrice(BigDecimal v) { item.unitPrice = v; return this; }
        public Builder subtotal(BigDecimal v) { item.subtotal = v; return this; }
        public OrderItem build() { return item; }
    }
}