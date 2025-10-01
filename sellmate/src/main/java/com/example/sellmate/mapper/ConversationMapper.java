package com.example.sellmate.mapper;

import com.example.sellmate.dto.request.CreateConversationRequest;
import com.example.sellmate.dto.response.ConversationResponse;
import com.example.sellmate.entity.Conversation;
import org.springframework.stereotype.Component;

@Component
public class ConversationMapper {

    public ConversationResponse toResponse(Conversation conversation){
        return new ConversationResponse(
                conversation.getId(),
                conversation.getUserAId(),
                conversation.getUserBId(),
                conversation.getCreatedAt()
        );
    }
    public Conversation toEntity(CreateConversationRequest request){
        Conversation conversation = new Conversation();
        conversation.setUserAId(request.userAId());
        conversation.setUserBId(request.userBId());
        return conversation;
    }

}
