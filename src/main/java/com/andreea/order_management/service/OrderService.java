package com.andreea.order_management.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.andreea.order_management.dto.CreateOrderRequest;
import com.andreea.order_management.dto.OrderItemRequest;
import com.andreea.order_management.exception.InsufficientStockException;
import com.andreea.order_management.exception.ResourceNotFoundException;
import com.andreea.order_management.model.Customer;
import com.andreea.order_management.model.Order;
import com.andreea.order_management.model.OrderItem;
import com.andreea.order_management.model.OrderStatus;
import com.andreea.order_management.model.Product;
import com.andreea.order_management.repository.CustomerRepository;
import com.andreea.order_management.repository.OrderRepository;
import com.andreea.order_management.repository.ProductRepository;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderEventPublisher orderEventPublisher;

    public OrderService(OrderRepository orderRepository, CustomerRepository customerRepository, ProductRepository productRepository, OrderEventPublisher orderEventPublisher) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.orderEventPublisher = orderEventPublisher;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + id));
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + request.getCustomerId()));

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderItems(new ArrayList<>());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for product id " + product.getId());
            }

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtTime(product.getPrice());
            
            order.getOrderItems().add(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            totalAmount = totalAmount.add(itemTotal);
        }
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        orderEventPublisher.publishOrderCreated(savedOrder);

        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus status){
        Order order = getOrderById(id);
        OrderStatus currentStatus = order.getStatus();

        if (!isValidTransition(currentStatus, status)) {
            throw new IllegalArgumentException("Invalid status transition from " + currentStatus + " to " + status);
        }

        order.setStatus(status);

        return orderRepository.save(order);
    }

    public void deleteOrder(Long id){
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id " + id);
        }
        orderRepository.deleteById(id);
    }

    private boolean isValidTransition(OrderStatus from, OrderStatus to) {
        return switch (from) {
            case PENDING -> to == OrderStatus.CONFIRMED || to == OrderStatus.CANCELED;
            case CONFIRMED -> to == OrderStatus.SHIPPED || to == OrderStatus.CANCELED;
            case SHIPPED -> to == OrderStatus.DELIVERED;
            case DELIVERED, CANCELED -> false;
        };
    }
}
