package com.farmchainx.dto;

import com.farmchainx.model.Batch;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BatchDTO {
    private Long id;
    private String batchCode;
    private String productName;
    private Long productId;
    private String farmerName;
    private Long farmerId;
    private String quantity;
    private BigDecimal price;
    private LocalDate harvestDate;
    private LocalDate expiryDate;
    private String farmLocation;
    private Boolean certified;
    private Batch.BatchStatus status;
    private LocalDateTime createdAt;

    public BatchDTO() {}

    public static BatchDTO from(Batch b) {
        BatchDTO dto = new BatchDTO();
        dto.id = b.getId();
        dto.batchCode = b.getBatchCode();
        dto.productName = b.getProduct().getName();
        dto.productId = b.getProduct().getId();
        dto.farmerName = b.getFarmer().getName();
        dto.farmerId = b.getFarmer().getId();
        dto.quantity = b.getQuantity();
        dto.price = b.getPrice();
        dto.harvestDate = b.getHarvestDate();
        dto.expiryDate = b.getExpiryDate();
        dto.farmLocation = b.getFarmLocation();
        dto.certified = b.getCertified();
        dto.status = b.getStatus();
        dto.createdAt = b.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getBatchCode() { return batchCode; }
    public String getProductName() { return productName; }
    public Long getProductId() { return productId; }
    public String getFarmerName() { return farmerName; }
    public Long getFarmerId() { return farmerId; }
    public String getQuantity() { return quantity; }
    public BigDecimal getPrice() { return price; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public String getFarmLocation() { return farmLocation; }
    public Boolean getCertified() { return certified; }
    public Batch.BatchStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setId(Long id) { this.id = id; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public void setFarmLocation(String farmLocation) { this.farmLocation = farmLocation; }
    public void setCertified(Boolean certified) { this.certified = certified; }
    public void setStatus(Batch.BatchStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}