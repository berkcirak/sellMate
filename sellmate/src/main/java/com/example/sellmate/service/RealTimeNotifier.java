package com.example.sellmate.service;

import com.example.sellmate.dto.response.NotificationResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RealTimeNotifier {

    private final SimpMessagingTemplate messagingTemplate;

    public RealTimeNotifier(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    public void pushToUser(Long userId, NotificationResponse payload){
        messagingTemplate.convertAndSend("/topic/users." + userId +".notifications", payload);
    }
}
