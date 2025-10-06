package com.example.sellmate.controller;

import com.example.sellmate.dto.request.SendMessageRequest;
import com.example.sellmate.dto.response.MessageResponse;
import com.example.sellmate.service.MessageService;
import com.example.sellmate.service.UserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageWebSocketController {

    private final MessageService messageService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;


    public MessageWebSocketController(MessageService messageService, UserService userService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
    }
    @MessageMapping("/message.send")
    public void sendMessage(SendMessageRequest request){
        MessageResponse messageResponse = messageService.send(request);
        Long conversationId = messageResponse.conversationId();
        messagingTemplate.convertAndSend("/topic/conversation." + conversationId, messageResponse);
    }

    @MessageMapping("/user.join")
    public void userJoin(){
        Long userId = userService.getCurrentUserId();
        messagingTemplate.convertAndSend("/topic/user.online", userId);
    }
    
}
