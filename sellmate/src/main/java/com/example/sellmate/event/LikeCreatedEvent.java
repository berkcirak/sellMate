package com.example.sellmate.event;

import java.time.Instant;

public record LikeCreatedEvent(
        String eventId,
        Long postId,
        Long postOwnerId,
        Long actorUserId,
        Instant occurredAt
) {}
