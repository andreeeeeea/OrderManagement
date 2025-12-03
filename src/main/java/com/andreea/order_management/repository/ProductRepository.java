package com.andreea.order_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andreea.order_management.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
}
