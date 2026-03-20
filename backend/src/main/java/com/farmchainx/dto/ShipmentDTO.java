package com.farmchainx.dto;

import com.farmchainx.model.Shipment;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ShipmentDTO {
    private Long id;
    private String shipmentCode;
    private String batchCode;
    private Long batchId;
    private String distributorName;
    private Long distributorId;
    private String fromLocation;
    private String toLocation;
    private String weight;
    private LocalDate eta;
    private Shipment.ShipmentStatus status;
    private LocalDateTime createdAt;

    public ShipmentDTO() {}

    public static ShipmentDTO from(Shipment s) {
        ShipmentDTO dto = new ShipmentDTO();
        dto.id = s.getId();
        dto.shipmentCode = s.getShipmentCode();
        dto.batchCode = s.getBatch().getBatchCode();
        dto.batchId = s.getBatch().getId();
        dto.distributorName = s.getDistributor().getName();
        dto.distributorId = s.getDistributor().getId();
        dto.fromLocation = s.getFromLocation();
        dto.toLocation = s.getToLocation();
        dto.weight = s.getWeight();
        dto.eta = s.getEta();
        dto.status = s.getStatus();
        dto.createdAt = s.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getShipmentCode() { return shipmentCode; }
    public String getBatchCode() { return batchCode; }
    public Long getBatchId() { return batchId; }
    public String getDistributorName() { return distributorName; }
    public Long getDistributorId() { return distributorId; }
    public String getFromLocation() { return fromLocation; }
    public String getToLocation() { return toLocation; }
    public String getWeight() { return weight; }
    public LocalDate getEta() { return eta; }
    public Shipment.ShipmentStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setId(Long id) { this.id = id; }
    public void setShipmentCode(String v) { this.shipmentCode = v; }
    public void setBatchCode(String v) { this.batchCode = v; }
    public void setBatchId(Long v) { this.batchId = v; }
    public void setDistributorName(String v) { this.distributorName = v; }
    public void setDistributorId(Long v) { this.distributorId = v; }
    public void setFromLocation(String v) { this.fromLocation = v; }
    public void setToLocation(String v) { this.toLocation = v; }
    public void setWeight(String v) { this.weight = v; }
    public void setEta(LocalDate v) { this.eta = v; }
    public void setStatus(Shipment.ShipmentStatus v) { this.status = v; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}