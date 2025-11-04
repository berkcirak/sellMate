package com.example.sellmate.event;

import java.math.BigDecimal;
import java.time.Instant;

public record OfferCreatedEvent(
        String eventId,
        Long postId,
        Long postOwnerId,
        Long bidderUserId,
        Long offerId,
        BigDecimal amount,
        Instant occurredAt
) {
}
