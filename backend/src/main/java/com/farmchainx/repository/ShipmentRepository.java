package com.farmchainx.repository;

import com.farmchainx.model.Shipment;
import com.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByDistributor(User distributor);
    List<Shipment> findByDistributorOrderByCreatedAtDesc(User distributor);
    Optional<Shipment> findByShipmentCode(String shipmentCode);
    long countByDistributorAndStatus(User distributor, Shipment.ShipmentStatus status);
}