package com.farmchainx.dto;

import java.math.BigDecimal;

public class ProductRequestDTO {
    private String name;
    private String description;
    private BigDecimal price;
    private String unit;
    private String icon;
    private String category;
    private String origin;
    private Integer stock;
    private Boolean certified;

    public ProductRequestDTO() {}
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Boolean getCertified() { return certified; }
    public void setCertified(Boolean certified) { this.certified = certified; }
}