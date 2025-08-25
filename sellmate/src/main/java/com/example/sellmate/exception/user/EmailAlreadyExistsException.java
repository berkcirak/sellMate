package com.example.sellmate.exception.user;

public class EmailAlreadyExistsException extends RuntimeException{
    public EmailAlreadyExistsException(String email){
        super("Email already exists: " + email);
    }
}
