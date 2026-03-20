package com.farmchainx.dto;

import java.util.List;

public class OrderRequestDTO {
    private List<OrderItemRequestDTO> items;
    private String deliveryAddress;
    private String paymentMethod;

    public OrderRequestDTO() {}
    public List<OrderItemRequestDTO> getItems() { return items; }
    public void setItems(List<OrderItemRequestDTO> items) { this.items = items; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}