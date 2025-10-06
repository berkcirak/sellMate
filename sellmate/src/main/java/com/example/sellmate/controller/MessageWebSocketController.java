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

    // Mesaj gönderme endpoint'i
    @MessageMapping("/message.send")
    public void sendMessage(SendMessageRequest request) {
        try {
            System.out.println("📨 WebSocket message received: " + request);

            // Mesajı kaydet
            MessageResponse messageResponse = messageService.send(request);

            // Conversation ID'yi al
            Long conversationId = messageResponse.conversationId();

            System.out.println("📤 Sending to topic: /topic/conversation." + conversationId);

            // Tüm konuşma katılımcılarına mesajı gönder
            messagingTemplate.convertAndSend("/topic/conversation." + conversationId, messageResponse);

            System.out.println("✅ Message sent successfully via RabbitMQ");

        } catch (Exception e) {
            System.err.println("❌ Error sending message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Kullanıcı bağlandığında
    @MessageMapping("/user.join")
    public void userJoin() {
        try {
            Long userId = userService.getCurrentUserId();
            System.out.println("👤 User joined: " + userId);
            messagingTemplate.convertAndSend("/topic/user.online", userId);
        } catch (Exception e) {
            System.err.println("❌ Error in user join: " + e.getMessage());
        }
    }
}