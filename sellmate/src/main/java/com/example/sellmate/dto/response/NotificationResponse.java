package com.example.sellmate.dto.response;

import com.example.sellmate.entity.enums.NotificationType;

import java.time.Instant;

public record NotificationResponse(
        String id,
        NotificationType type,
        String message,
        Long actorId,
        Long postId,
        Instant createdAt
) {
}
