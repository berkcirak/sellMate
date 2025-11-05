package com.example.sellmate.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
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
    //

    @Bean
    public TopicExchange notificationExchange(){
        return new TopicExchange("notification.exchange");
    }
    @Bean
    public Queue notificationQueue(){
        return QueueBuilder.durable("notification.service.queue")
                .withArgument("x-dead-letter-exchange", "notification.dlx")
                .withArgument("x-dead-letter-routing-key", "notification.dlq")
                .build();
    }
    @Bean
    public TopicExchange notificationDlx(){
        return new TopicExchange("notification.dlx");
    }
    @Bean
    public Queue notificationDlq(){
        return QueueBuilder.durable("notification.service.dlq").build();
    }
    @Bean
    public Binding notificationBinding(){
        return BindingBuilder
                .bind(notificationQueue())
                .to(notificationExchange())
                .with("notification.#");
    }
    @Bean
    public Binding notificationDlqBinding(){
        return BindingBuilder
                .bind(notificationDlq())
                .to(notificationDlx())
                .with("notification.dlq");
    }
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory, MessageConverter messageConverter){
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        return factory;
    }

}