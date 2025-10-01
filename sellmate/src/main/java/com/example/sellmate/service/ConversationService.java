package com.example.sellmate.service;

import com.example.sellmate.entity.Conversation;
import com.example.sellmate.exception.comment.CommentNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.repository.ConversationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserService userService;

    public ConversationService(ConversationRepository conversationRepository, UserService userService){
        this.conversationRepository=conversationRepository;
        this.userService=userService;
    }
    @Transactional
    public Conversation getOrCreateConversation(Long otherUserId){
        Long me = userService.getCurrentUserId();
        if (me.equals(otherUserId)){
            throw new IllegalArgumentException("Self conversation is not allowed");
        }
        Long a = Math.min(me, otherUserId);
        Long b = Math.max(me, otherUserId);

        return conversationRepository.findByUserAIdAndUserBId(a, b)
                .orElseGet(() -> {
                    Conversation conversation = new Conversation();
                    conversation.setUserAId(a);
                    conversation.setUserBId(b);
                    return conversationRepository.save(conversation);
                });
    }
    @Transactional(readOnly = true)
    public Conversation getByIdOrThrow(Long conversationId){
        return conversationRepository.findById(conversationId).orElseThrow(() -> new CommentNotFoundException(conversationId));
    }
    @Transactional(readOnly = true)
    public void assertCurrentUserIsParticipant(Long conversationId){
        Long myId = userService.getCurrentUserId();
        Conversation conversation = getByIdOrThrow(conversationId);
        if (!conversation.getUserAId().equals(myId) || !conversation.getUserBId().equals(myId)){
            throw new UnauthorizedException("You are not participant this conversation");
        }
    }
    @Transactional(readOnly = true)
    public List<Conversation> listMyConversations(){
        Long myId = userService.getCurrentUserId();
        return conversationRepository.findByUserAIdOrUserBId(myId, myId);
    }


}
