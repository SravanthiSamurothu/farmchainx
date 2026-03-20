package com.farmchainx.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BatchRequestDTO {
    private Long productId;
    private String quantity;
    private BigDecimal price;
    private LocalDate harvestDate;
    private LocalDate expiryDate;
    private String farmLocation;
    private Boolean certified;

    public BatchRequestDTO() {}
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public LocalDate getHarvestDate() { return harvestDate; }
    public void setHarvestDate(LocalDate harvestDate) { this.harvestDate = harvestDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getFarmLocation() { return farmLocation; }
    public void setFarmLocation(String farmLocation) { this.farmLocation = farmLocation; }
    public Boolean getCertified() { return certified; }
    public void setCertified(Boolean certified) { this.certified = certified; }
}