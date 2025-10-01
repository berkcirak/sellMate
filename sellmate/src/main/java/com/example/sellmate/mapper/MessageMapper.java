package com.example.sellmate.mapper;

import com.example.sellmate.dto.request.SendMessageRequest;
import com.example.sellmate.dto.response.MessageResponse;
import com.example.sellmate.entity.Conversation;
import com.example.sellmate.entity.Message;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

    public MessageResponse toResponse(Message message){
        return new MessageResponse(message.getId(),
                message.getConversation().getId(),
                message.getSenderId(),
                message.getContent(),
                message.getCreatedAt());
    }
    public Message toEntity(SendMessageRequest request, Conversation conversation, Long senderId){
        Message message = new Message();
        message.setSenderId(senderId);
        message.setContent(request.content().trim());
        message.setConversation(conversation);
        return message;
    }
}
