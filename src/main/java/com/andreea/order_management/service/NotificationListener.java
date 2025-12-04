package com.andreea.order_management.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.andreea.order_management.config.RabbitMQConfig;
import com.andreea.order_management.dto.OrderEvent;

@Service
public class NotificationListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);

    @RabbitListener(queues = RabbitMQConfig.ORDER_QUEUE)
    public void handleOrderCreated(OrderEvent event) {
        log.info("=== NOTIFICATION RECEIVED ===");
        log.info("New order received.");
        log.info("Order ID: {}", event.getOrderId());
        log.info("Customer ID: {}", event.getCustomerId());
        log.info("Customer Name: {}", event.getCustomerName());
        log.info("Total Amount: {}", event.getTotalAmount());
        log.info("Status: {}", event.getStatus());
        log.info("Date: {}", event.getCreatedAt());
        log.info("=============================");
    }
}
