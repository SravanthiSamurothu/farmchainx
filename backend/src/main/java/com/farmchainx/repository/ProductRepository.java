package com.farmchainx.repository;

import com.farmchainx.model.Product;
import com.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByFarmer(User farmer);
    List<Product> findByCategory(String category);
    List<Product> findByCertified(Boolean certified);

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> searchProducts(String category, String search);
}