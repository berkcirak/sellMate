package com.example.sellmate.dto.response;

import com.example.sellmate.entity.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderResponse(
        Long id,
        Long buyerId,
        Long sellerId,
        Long postId,
        BigDecimal price,
        OrderStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
