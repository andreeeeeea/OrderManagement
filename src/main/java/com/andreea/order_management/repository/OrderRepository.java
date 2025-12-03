package com.andreea.order_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.andreea.order_management.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{
}
