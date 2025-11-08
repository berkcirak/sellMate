package com.example.sellmate.mapper;

import com.example.sellmate.dto.response.NotificationResponse;
import com.example.sellmate.entity.Notification;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
@Component
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification){
        return new NotificationResponse(
                notification.getId().toString(),
                notification.getType(),
                notification.getMessage(),
                notification.getActorId(),
                notification.getPostId(),
                notification.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant());
    }

}
