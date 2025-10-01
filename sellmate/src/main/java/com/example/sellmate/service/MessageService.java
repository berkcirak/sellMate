package com.example.sellmate.service;

import com.example.sellmate.dto.request.SendMessageRequest;
import com.example.sellmate.dto.response.MessageResponse;
import com.example.sellmate.entity.Conversation;
import com.example.sellmate.entity.Message;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.mapper.MessageMapper;
import com.example.sellmate.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final ConversationService conversationService;
    private final MessageMapper messageMapper;
    public MessageService(MessageRepository messageRepository, UserService userService, ConversationService conversationService, MessageMapper messageMapper){
        this.messageRepository=messageRepository;
        this.userService=userService;
        this.conversationService=conversationService;
        this.messageMapper=messageMapper;
    }

    @Transactional
    public MessageResponse send(SendMessageRequest request){
        Long senderId = userService.getCurrentUserId();
        Conversation conversation = conversationService.getByIdOrThrowEntity(request.conversationId());
        if (!isParticipant(conversation, senderId)){
            throw new UnauthorizedException("You are not participant of this conversation");
        }
        Message message = messageMapper.toEntity(request, conversation, senderId);
        messageRepository.save(message);
        return messageMapper.toResponse(message);
    }
    @Transactional(readOnly = true)
    public List<MessageResponse> getRecentMessages(Long conversationId){
        Long myId = userService.getCurrentUserId();
        Conversation conversation = conversationService.getByIdOrThrowEntity(conversationId);
        if (!isParticipant(conversation, myId)){
            throw new UnauthorizedException("You are not participant of this conversation");
        }
        List<Message> messages = messageRepository.findByConversationOrderByCreatedAtAsc(conversation);
        return messages.stream().map(messageMapper::toResponse).toList();
    }

    private boolean isParticipant(Conversation conversation, Long userId){
        return conversation.getUserAId().equals(userId) || conversation.getUserBId().equals(userId);
    }

}
