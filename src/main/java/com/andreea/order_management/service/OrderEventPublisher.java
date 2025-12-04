package com.andreea.order_management.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.andreea.order_management.config.RabbitMQConfig;
import com.andreea.order_management.dto.OrderEvent;
import com.andreea.order_management.model.Order;

@Service
public class OrderEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public OrderEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOrderCreated(Order order) {
        OrderEvent orderEvent = new OrderEvent();
        orderEvent.setOrderId(order.getId());
        orderEvent.setCustomerId(order.getCustomer().getId());
        orderEvent.setCustomerName(order.getCustomer().getName());
        orderEvent.setCustomerEmail(order.getCustomer().getEmail());
        orderEvent.setCustomerPhone(order.getCustomer().getPhone());
        orderEvent.setTotalAmount(order.getTotalAmount());
        orderEvent.setStatus(order.getStatus().name());
        orderEvent.setCreatedAt(order.getCreatedAt());

        rabbitTemplate.convertAndSend(RabbitMQConfig.ORDER_QUEUE, orderEvent);
    }
}
