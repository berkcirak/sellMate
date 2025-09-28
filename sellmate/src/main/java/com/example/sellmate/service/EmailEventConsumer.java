package com.example.sellmate.service;

import com.example.sellmate.event.WelcomeEmailEvent;
import com.example.sellmate.exception.mail.MailCannotSendException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class EmailEventConsumer {

    private final EmailService emailService;
    public EmailEventConsumer(EmailService emailService) {
        this.emailService = emailService;
    }
    @RabbitListener(queues = "welcome.email.queue")
    public void handleWelcomeEmail(WelcomeEmailEvent event){
        try {
            emailService.sendWelcomeEmail(
                    event.email(),
                    event.firstName(),
                    event.lastName()
            );
        } catch (Exception e){
            throw new MailCannotSendException(event.email());
        }
    }
}
