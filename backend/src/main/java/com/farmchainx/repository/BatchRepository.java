package com.farmchainx.repository;

import com.farmchainx.model.Batch;
import com.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByFarmer(User farmer);
    List<Batch> findByFarmerOrderByCreatedAtDesc(User farmer);
    Optional<Batch> findByBatchCode(String batchCode);
    long countByFarmer(User farmer);
}