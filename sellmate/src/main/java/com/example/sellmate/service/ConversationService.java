package com.example.sellmate.service;

import com.example.sellmate.dto.response.ConversationResponse;
import com.example.sellmate.entity.Conversation;
import com.example.sellmate.exception.comment.CommentNotFoundException;
import com.example.sellmate.exception.conversation.ConversationNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.mapper.ConversationMapper;
import com.example.sellmate.repository.ConversationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserService userService;
    private final ConversationMapper conversationMapper;

    public ConversationService(ConversationRepository conversationRepository, UserService userService, ConversationMapper conversationMapper){
        this.conversationRepository=conversationRepository;
        this.userService=userService;
        this.conversationMapper=conversationMapper;
    }
    @Transactional
    public ConversationResponse getOrCreateConversation(Long otherUserId){
        Long me = userService.getCurrentUserId();
        if (me.equals(otherUserId)){
            throw new IllegalArgumentException("Self conversation is not allowed");
        }
        Long a = Math.min(me, otherUserId);
        Long b = Math.max(me, otherUserId);

        Conversation conversation = conversationRepository.findByUserAIdAndUserBId(a, b)
                .orElseGet(() -> {
                    Conversation newConversation = new Conversation();
                    newConversation.setUserAId(a);
                    newConversation.setUserBId(b);
                    return conversationRepository.save(newConversation);
                });
        return conversationMapper.toResponse(conversation);
    }
    @Transactional(readOnly = true)
    public ConversationResponse getByIdOrThrow(Long conversationId){
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new CommentNotFoundException(conversationId));
        return conversationMapper.toResponse(conversation);
    }
    @Transactional(readOnly = true)
    public void assertCurrentUserIsParticipant(Long conversationId){
        Long myId = userService.getCurrentUserId();
        ConversationResponse conversation = getByIdOrThrow(conversationId);
        if (!conversation.userAId().equals(myId) || !conversation.userBId().equals(myId)){
            throw new UnauthorizedException("You are not participant this conversation");
        }
    }
    @Transactional(readOnly = true)
    public List<ConversationResponse> listMyConversations(){
        Long myId = userService.getCurrentUserId();
        List<Conversation> conversationList = conversationRepository.findByUserAIdOrUserBId(myId, myId);
        return conversationList.stream().map(conversationMapper::toResponse).toList();
    }


    public Conversation getByIdOrThrowEntity(Long conversationId) {
        return conversationRepository.findById(conversationId).orElseThrow(() -> new ConversationNotFoundException(conversationId));
    }
}
