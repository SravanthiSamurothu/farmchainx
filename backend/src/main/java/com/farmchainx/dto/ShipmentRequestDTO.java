package com.farmchainx.dto;

import java.time.LocalDate;

public class ShipmentRequestDTO {
    private Long batchId;
    private String fromLocation;
    private String toLocation;
    private String weight;
    private LocalDate eta;

    public ShipmentRequestDTO() {}
    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }
    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }
    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }
    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }
    public LocalDate getEta() { return eta; }
    public void setEta(LocalDate eta) { this.eta = eta; }
}