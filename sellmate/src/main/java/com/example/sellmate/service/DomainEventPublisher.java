package com.example.sellmate.service;

import com.example.sellmate.event.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class DomainEventPublisher {

    private final RabbitTemplate rabbitTemplate;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DomainEventPublisher.class);


    public DomainEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    public void publishLike(LikeCreatedEvent event){
        log.info("Publishing LIKE event: {}", event);
        rabbitTemplate.convertAndSend("notification.exchange", "notification.like", event);
    }
    public void publishComment(CommentCreatedEvent event){
        log.info("Publishing COMMENT event: {}", event);
        rabbitTemplate.convertAndSend("notification.exchange", "notification.comment", event);
    }
    public void publishOrder(OrderPlacedEvent event){
        log.info("Publishing ORDER event: {}", event);
        rabbitTemplate.convertAndSend("notification.exchange", "notification.order", event);
    }
    public void publishOfferCreated(OfferCreatedEvent event){
        log.info("Publishing OFFER event: {}", event);
        rabbitTemplate.convertAndSend("notification.exchange", "notification.offer.created", event);
    }
    public void publishOfferDecision(OfferDecisionEvent event){
        log.info("Publishing DECISION event: {}", event);
        rabbitTemplate.convertAndSend("notification.exchange", "notification.offer.decision", event);
    }

}
