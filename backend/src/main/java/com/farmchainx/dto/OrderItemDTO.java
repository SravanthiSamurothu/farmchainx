package com.farmchainx.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productIcon;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public OrderItemDTO() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final OrderItemDTO dto = new OrderItemDTO();
        public Builder id(Long v) { dto.id = v; return this; }
        public Builder productId(Long v) { dto.productId = v; return this; }
        public Builder productName(String v) { dto.productName = v; return this; }
        public Builder productIcon(String v) { dto.productIcon = v; return this; }
        public Builder quantity(Integer v) { dto.quantity = v; return this; }
        public Builder unitPrice(BigDecimal v) { dto.unitPrice = v; return this; }
        public Builder subtotal(BigDecimal v) { dto.subtotal = v; return this; }
        public OrderItemDTO build() { return dto; }
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getProductIcon() { return productIcon; }
    public Integer getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setId(Long id) { this.id = id; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setProductIcon(String productIcon) { this.productIcon = productIcon; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}