package com.farmchainx.repository;

import com.farmchainx.model.Order;
import com.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByConsumerOrderByCreatedAtDesc(User consumer);
    Optional<Order> findByOrderCode(String orderCode);
    long countByConsumer(User consumer);
}