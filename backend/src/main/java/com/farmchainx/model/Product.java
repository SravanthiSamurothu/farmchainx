package com.farmchainx.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotBlank
    private String unit;

    private String icon;

    @NotBlank
    private String category;

    private String origin;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(nullable = false)
    private Boolean certified = false;

    @Column(nullable = false)
    private BigDecimal rating = BigDecimal.valueOf(0.0);

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Constructors ──────────────────────────────────────────────────────────
    public Product() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public String getUnit() { return unit; }
    public String getIcon() { return icon; }
    public String getCategory() { return category; }
    public String getOrigin() { return origin; }
    public Integer getStock() { return stock; }
    public Boolean getCertified() { return certified; }
    public BigDecimal getRating() { return rating; }
    public User getFarmer() { return farmer; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setUnit(String unit) { this.unit = unit; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setCategory(String category) { this.category = category; }
    public void setOrigin(String origin) { this.origin = origin; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setCertified(Boolean certified) { this.certified = certified; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public void setFarmer(User farmer) { this.farmer = farmer; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Product product = new Product();
        public Builder name(String v) { product.name = v; return this; }
        public Builder description(String v) { product.description = v; return this; }
        public Builder price(BigDecimal v) { product.price = v; return this; }
        public Builder unit(String v) { product.unit = v; return this; }
        public Builder icon(String v) { product.icon = v; return this; }
        public Builder category(String v) { product.category = v; return this; }
        public Builder origin(String v) { product.origin = v; return this; }
        public Builder stock(Integer v) { product.stock = v; return this; }
        public Builder certified(Boolean v) { product.certified = v; return this; }
        public Builder rating(BigDecimal v) { product.rating = v; return this; }
        public Builder farmer(User v) { product.farmer = v; return this; }
        public Product build() { return product; }
    }
}