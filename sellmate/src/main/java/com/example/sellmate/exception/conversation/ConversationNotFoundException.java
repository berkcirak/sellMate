package com.example.sellmate.exception.conversation;

public class ConversationNotFoundException extends RuntimeException{

    public ConversationNotFoundException(Long conversationId){
        super("Conversation not found by id: " + conversationId);
    }
}
