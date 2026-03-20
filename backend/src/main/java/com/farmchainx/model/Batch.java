package com.farmchainx.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "batches")
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_code", unique = true, nullable = false)
    private String batchCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @NotBlank
    private String quantity;

    @NotNull
    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "farm_location")
    private String farmLocation;

    @Column(nullable = false)
    private Boolean certified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BatchStatus status = BatchStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum BatchStatus { PENDING, PROCESSING, IN_TRANSIT, DELIVERED }

    // ── Constructors ──────────────────────────────────────────────────────────
    public Batch() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public String getBatchCode() { return batchCode; }
    public Product getProduct() { return product; }
    public User getFarmer() { return farmer; }
    public String getQuantity() { return quantity; }
    public BigDecimal getPrice() { return price; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public String getFarmLocation() { return farmLocation; }
    public Boolean getCertified() { return certified; }
    public BatchStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    public void setProduct(Product product) { this.product = product; }
    public void setFarmer(User farmer) { this.farmer = farmer; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public void setFarmLocation(String farmLocation) { this.farmLocation = farmLocation; }
    public void setCertified(Boolean certified) { this.certified = certified; }
    public void setStatus(BatchStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Batch batch = new Batch();
        public Builder batchCode(String v) { batch.batchCode = v; return this; }
        public Builder product(Product v) { batch.product = v; return this; }
        public Builder farmer(User v) { batch.farmer = v; return this; }
        public Builder quantity(String v) { batch.quantity = v; return this; }
        public Builder price(BigDecimal v) { batch.price = v; return this; }
        public Builder harvestDate(LocalDate v) { batch.harvestDate = v; return this; }
        public Builder expiryDate(LocalDate v) { batch.expiryDate = v; return this; }
        public Builder farmLocation(String v) { batch.farmLocation = v; return this; }
        public Builder certified(Boolean v) { batch.certified = v; return this; }
        public Builder status(BatchStatus v) { batch.status = v; return this; }
        public Batch build() { return batch; }
    }
}