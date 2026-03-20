package com.farmchainx.dto;

import com.farmchainx.model.Product;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String unit;
    private String icon;
    private String category;
    private String origin;
    private Integer stock;
    private Boolean certified;
    private BigDecimal rating;
    private String farmerName;
    private Long farmerId;
    private LocalDateTime createdAt;

    public ProductDTO() {}

    public static ProductDTO from(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.id = p.getId();
        dto.name = p.getName();
        dto.description = p.getDescription();
        dto.price = p.getPrice();
        dto.unit = p.getUnit();
        dto.icon = p.getIcon();
        dto.category = p.getCategory();
        dto.origin = p.getOrigin();
        dto.stock = p.getStock();
        dto.certified = p.getCertified();
        dto.rating = p.getRating();
        dto.farmerName = p.getFarmer().getName();
        dto.farmerId = p.getFarmer().getId();
        dto.createdAt = p.getCreatedAt();
        return dto;
    }

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
    public String getFarmerName() { return farmerName; }
    public Long getFarmerId() { return farmerId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String d) { this.description = d; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setUnit(String unit) { this.unit = unit; }
    public void setIcon(String icon) { this.icon = icon; }
    public void setCategory(String category) { this.category = category; }
    public void setOrigin(String origin) { this.origin = origin; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setCertified(Boolean certified) { this.certified = certified; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}