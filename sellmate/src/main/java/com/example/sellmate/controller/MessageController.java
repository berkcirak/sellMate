package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.SendMessageRequest;
import com.example.sellmate.dto.response.MessageResponse;
import com.example.sellmate.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {


    private final MessageService messageService;
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ApiResponse<MessageResponse> sendMessage(@RequestBody SendMessageRequest messageRequest, HttpServletRequest httpServletRequest){
        MessageResponse message = messageService.send(messageRequest);
        return ApiResponse.success(message, "Message sent successfully", httpServletRequest.getRequestURI());
    }
    @GetMapping("/{conversationId}")
    public ApiResponse<List<MessageResponse>> getMessages(@PathVariable Long conversationId, HttpServletRequest httpServletRequest){
        List<MessageResponse> messageResponseList = messageService.getRecentMessages(conversationId);
        return ApiResponse.success(messageResponseList, "Messages retrieved successfully", httpServletRequest.getRequestURI());
    }



}
