package com.example.sellmate.exception.user;

public class EmailNotFoundException extends RuntimeException{

    public EmailNotFoundException(String email){
        super("Email not found: " + email);
    }
}
