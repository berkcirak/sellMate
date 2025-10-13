package com.example.sellmate.dto.response;

import com.example.sellmate.entity.enums.OfferStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OfferResponse(
        Long id,
        Long buyerId,
        Long postId,
        BigDecimal offeredPrice,
        OfferStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
