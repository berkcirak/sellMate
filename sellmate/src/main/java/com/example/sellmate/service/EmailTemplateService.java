package com.example.sellmate.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;

@Service
public class EmailTemplateService {

    private final TemplateEngine templateEngine;


    public EmailTemplateService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }
    public String buildWelcomeEmail(String firstName, String lastName){
        Context context = new Context();
        context.setVariable("firstName", firstName);
        context.setVariable("lastName", lastName);
        context.setVariable("currentYear", LocalDateTime.now().getYear());
        context.setVariable("appUrl", "http://localhost:3000");
        return templateEngine.process("email/welcome-email", context);
    }
}
