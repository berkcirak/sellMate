package com.example.sellmate.service;

import com.example.sellmate.exception.mail.MailCannotSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final EmailTemplateService emailTemplateService;


    public EmailService(JavaMailSender javaMailSender, EmailTemplateService emailTemplateService) {
        this.javaMailSender = javaMailSender;
        this.emailTemplateService = emailTemplateService;
    }
    public void sendWelcomeEmail(String email, String firstName, String lastName){
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage,true, "UTF-8");
            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setSubject("SellMate'e Hoşgeldiniz!");
            mimeMessageHelper.setText(emailTemplateService.buildWelcomeEmail(firstName, lastName), true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new MailCannotSendException(email);
        }

    }
}
