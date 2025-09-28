package com.example.sellmate.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.MessageConverter;

@Configuration
public class RabbitMQConfig {

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public Queue welcomeEmailQueue() {
        return QueueBuilder.durable("welcome.email.queue").build();
    }

    @Bean
    public TopicExchange emailExchange() {
        return new TopicExchange("email.exchange");
    }

    @Bean
    public Binding welcomeEmailBinding() {
        return BindingBuilder
                .bind(welcomeEmailQueue())
                .to(emailExchange())
                .with("email.welcome");
    }
}