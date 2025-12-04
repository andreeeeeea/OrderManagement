package com.andreea.order_management.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.SerializerMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String ORDER_QUEUE = "order.created";

    @Bean
    public Queue orderQueue() {
        return new Queue(ORDER_QUEUE, true);
    }

    @Bean
    public SerializerMessageConverter messageConverter() {
        SerializerMessageConverter converter = new SerializerMessageConverter();
        converter.setAllowedListPatterns(java.util.List.of("com.andreea.order_management.*", "java.*"));
        return converter;
    }
}
