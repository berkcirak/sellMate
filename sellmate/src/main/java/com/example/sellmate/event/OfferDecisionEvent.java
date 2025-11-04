package com.example.sellmate.event;

import com.example.sellmate.entity.enums.NotificationType;

import java.time.Instant;

public record OfferDecisionEvent(
        String eventId,
        Long offerId,
        Long postId,
        Long postOwnerId,
        Long bidderUserId,
        NotificationType decision,
        Instant occurredAt
) {
}
