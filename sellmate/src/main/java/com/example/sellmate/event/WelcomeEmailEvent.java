package com.example.sellmate.event;

import java.time.LocalDateTime;

public record WelcomeEmailEvent(
        String email,
        String firstName,
        String lastName,
        LocalDateTime timestamp
) {
    public WelcomeEmailEvent(String email, String firstName, String lastName){
        this(email, firstName, lastName, LocalDateTime.now());
    }
}
