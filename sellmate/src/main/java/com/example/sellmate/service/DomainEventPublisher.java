package com.example.sellmate.service;

import com.example.sellmate.event.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class DomainEventPublisher {

    private final RabbitTemplate rabbitTemplate;


    public DomainEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    public void publishLike(LikeCreatedEvent event){
        rabbitTemplate.convertAndSend("notification.exchange", "notification.like", event);
    }
    public void publishComment(CommentCreatedEvent event){
        rabbitTemplate.convertAndSend("notification.exchange", "notification.comment", event);
    }
    public void publishOrder(OrderPlacedEvent event){
        rabbitTemplate.convertAndSend("notification.exchange", "notification.order", event);
    }
    public void publishOfferCreated(OfferCreatedEvent event){
        rabbitTemplate.convertAndSend("notification.exchange", "notification.offer.created", event);
    }
    public void publishOfferDecision(OfferDecisionEvent event){
        rabbitTemplate.convertAndSend("notification.exchange", "notification.offer.decision", event);
    }

}
