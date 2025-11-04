package com.example.sellmate.event;

import java.time.Instant;

public record OfferDecisionEvent(
        String eventId,
        Long offerId,
        Long postId,
        Long postOwnerId,
        Long bidderUserId,
        OfferDecision decision,
        Instant occurredAt
) {
}
