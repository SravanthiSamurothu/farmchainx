package com.farmchainx.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_code", unique = true, nullable = false)
    private String shipmentCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distributor_id", nullable = false)
    private User distributor;

    @Column(name = "from_location", nullable = false)
    private String fromLocation;

    @Column(name = "to_location", nullable = false)
    private String toLocation;

    private String weight;

    @Column(name = "eta")
    private LocalDate eta;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status = ShipmentStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ShipmentStatus { PENDING, IN_TRANSIT, DELIVERED }

    // ── Constructors ──────────────────────────────────────────────────────────
    public Shipment() {}

    // ── Getters ───────────────────────────────────────────────────────────────
    public Long getId() { return id; }
    public String getShipmentCode() { return shipmentCode; }
    public Batch getBatch() { return batch; }
    public User getDistributor() { return distributor; }
    public String getFromLocation() { return fromLocation; }
    public String getToLocation() { return toLocation; }
    public String getWeight() { return weight; }
    public LocalDate getEta() { return eta; }
    public ShipmentStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ── Setters ───────────────────────────────────────────────────────────────
    public void setId(Long id) { this.id = id; }
    public void setShipmentCode(String shipmentCode) { this.shipmentCode = shipmentCode; }
    public void setBatch(Batch batch) { this.batch = batch; }
    public void setDistributor(User distributor) { this.distributor = distributor; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }
    public void setWeight(String weight) { this.weight = weight; }
    public void setEta(LocalDate eta) { this.eta = eta; }
    public void setStatus(ShipmentStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // ── Builder ───────────────────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Shipment s = new Shipment();
        public Builder shipmentCode(String v) { s.shipmentCode = v; return this; }
        public Builder batch(Batch v) { s.batch = v; return this; }
        public Builder distributor(User v) { s.distributor = v; return this; }
        public Builder fromLocation(String v) { s.fromLocation = v; return this; }
        public Builder toLocation(String v) { s.toLocation = v; return this; }
        public Builder weight(String v) { s.weight = v; return this; }
        public Builder eta(LocalDate v) { s.eta = v; return this; }
        public Builder status(ShipmentStatus v) { s.status = v; return this; }
        public Shipment build() { return s; }
    }
}