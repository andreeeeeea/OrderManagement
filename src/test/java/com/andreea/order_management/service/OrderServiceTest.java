package com.andreea.order_management.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.andreea.order_management.dto.CreateOrderRequest;
import com.andreea.order_management.dto.OrderItemRequest;
import com.andreea.order_management.exception.InsufficientStockException;
import com.andreea.order_management.exception.ResourceNotFoundException;
import com.andreea.order_management.model.Customer;
import com.andreea.order_management.model.Order;
import com.andreea.order_management.model.OrderStatus;
import com.andreea.order_management.model.Product;
import com.andreea.order_management.repository.CustomerRepository;
import com.andreea.order_management.repository.OrderRepository;
import com.andreea.order_management.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {
    @Mock
    private OrderRepository orderRepository;

    @Mock 
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    private Customer testCustomer;
    private Product testProduct;

    @BeforeEach
    void setUp(){
        testCustomer = new Customer();
        testCustomer.setId(1L);
        testCustomer.setName("John Doe");
        testCustomer.setEmail("john@example.com");
        testCustomer.setPhone("123456789");

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setDescription("A product for testing");
        testProduct.setPrice(new BigDecimal("19.99"));
        testProduct.setStockQuantity(10);
    }

    @Test
    void createOrder_Success() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(2);
        request.setItems(List.of(itemRequest));

        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.createOrder(request);

        assertNotNull(result);
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(BigDecimal.valueOf(19.99 * 2), result.getTotalAmount());
        assertEquals(8, testProduct.getStockQuantity());
        verify(productRepository).save(testProduct);
    }

    @Test
    void createOrder_CustomerNotFound_ThrowsException() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(999L);
        request.setItems(List.of());

        when(customerRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            orderService.createOrder(request);
        });
    }

    @Test
    void createOrder_InsufficientStock_ThrowsException() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(20);
        request.setItems(List.of(itemRequest));

        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        assertThrows(InsufficientStockException.class, () -> {
            orderService.createOrder(request);
        });
    }

    @Test
    void updateOrderStatus_ValidTransition_Success() {
        Order existingOrder = new Order();
        existingOrder.setId(1L);
        existingOrder.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(existingOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order updatedOrder = orderService.updateOrderStatus(1L, OrderStatus.CONFIRMED);

        assertNotNull(updatedOrder);
        assertEquals(OrderStatus.CONFIRMED, updatedOrder.getStatus());
    }

    @Test
    void updateOrderStatus_InvalidTransition_ThrowsException() {
        Order existingOrder = new Order();
        existingOrder.setId(1L);
        existingOrder.setStatus(OrderStatus.DELIVERED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(existingOrder));

        assertThrows(IllegalArgumentException.class, () -> {
            orderService.updateOrderStatus(1L, OrderStatus.SHIPPED);
        });
    }
    
}
