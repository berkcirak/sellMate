package com.example.sellmate.service;

import com.example.sellmate.event.WelcomeEmailEvent;
import com.example.sellmate.exception.mail.MailCannotSendException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class EmailEventProducer {

    private final RabbitTemplate rabbitTemplate;


    public EmailEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    public void sendWelcomeEmailEvent(WelcomeEmailEvent event){
        try {
            rabbitTemplate.convertAndSend("email.exchange", "email.welcome", event);
        } catch (Exception e){
            throw new MailCannotSendException(event.email());
        }
    }
}
