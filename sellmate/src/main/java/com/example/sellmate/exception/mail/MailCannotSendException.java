package com.example.sellmate.exception.mail;

public class MailCannotSendException extends RuntimeException{

    public MailCannotSendException(String email){
        super("Mail cannot sent to: " + email);
    }

}
