package com.example.sellmate.event;

import java.time.Instant;

public record CommentCreatedEvent(
        String eventId,
        Long postId,
        Long postOwnerId,
        Long actorUserId,
        String commentExcerpt,
        Instant occurredAt
) {}
