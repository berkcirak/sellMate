package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.response.ConversationResponse;
import com.example.sellmate.service.ConversationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/conversation")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }
    @GetMapping("/list")
    public ApiResponse<List<ConversationResponse>> getMyConversations(HttpServletRequest httpServletRequest){
        List<ConversationResponse> conversationList = conversationService.listMyConversations();
        return ApiResponse.success(conversationList, "Conversations retrieved successfully", httpServletRequest.getRequestURI());
    }
    @GetMapping("/{conversationId}")
    public ApiResponse<ConversationResponse> getConversation(@PathVariable Long conversationId, HttpServletRequest httpServletRequest){
        ConversationResponse conversationResponse = conversationService.getById(conversationId);
        return ApiResponse.success(conversationResponse, "Conversation retrieved successfully", httpServletRequest.getRequestURI());
    }

}
