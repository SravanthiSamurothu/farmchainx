package com.farmchainx.dto;

import com.farmchainx.model.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Long id;
    private String orderCode;
    private String consumerName;
    private Long consumerId;
    private List<OrderItemDTO> items;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private String paymentMethod;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;

    public OrderDTO() {}

    public static OrderDTO from(Order o) {
        OrderDTO dto = new OrderDTO();
        dto.id = o.getId();
        dto.orderCode = o.getOrderCode();
        dto.consumerName = o.getConsumer().getName();
        dto.consumerId = o.getConsumer().getId();
        dto.items = o.getItems().stream().map(i ->
            OrderItemDTO.builder()
                .id(i.getId())
                .productId(i.getProduct().getId())
                .productName(i.getProduct().getName())
                .productIcon(i.getProduct().getIcon())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .subtotal(i.getSubtotal())
                .build()
        ).toList();
        dto.totalAmount = o.getTotalAmount();
        dto.deliveryAddress = o.getDeliveryAddress();
        dto.paymentMethod = o.getPaymentMethod();
        dto.status = o.getStatus();
        dto.createdAt = o.getCreatedAt();
        return dto;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final OrderDTO dto = new OrderDTO();
        public Builder id(Long v) { dto.id = v; return this; }
        public Builder orderCode(String v) { dto.orderCode = v; return this; }
        public Builder consumerName(String v) { dto.consumerName = v; return this; }
        public Builder consumerId(Long v) { dto.consumerId = v; return this; }
        public Builder items(List<OrderItemDTO> v) { dto.items = v; return this; }
        public Builder totalAmount(BigDecimal v) { dto.totalAmount = v; return this; }
        public Builder deliveryAddress(String v) { dto.deliveryAddress = v; return this; }
        public Builder paymentMethod(String v) { dto.paymentMethod = v; return this; }
        public Builder status(Order.OrderStatus v) { dto.status = v; return this; }
        public Builder createdAt(LocalDateTime v) { dto.createdAt = v; return this; }
        public OrderDTO build() { return dto; }
    }

    public Long getId() { return id; }
    public String getOrderCode() { return orderCode; }
    public String getConsumerName() { return consumerName; }
    public Long getConsumerId() { return consumerId; }
    public List<OrderItemDTO> getItems() { return items; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String getPaymentMethod() { return paymentMethod; }
    public Order.OrderStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setId(Long id) { this.id = id; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public void setConsumerName(String consumerName) { this.consumerName = consumerName; }
    public void setConsumerId(Long consumerId) { this.consumerId = consumerId; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setStatus(Order.OrderStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}