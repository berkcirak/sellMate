package com.example.sellmate.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
        Long id,
        String title,
        String description,
        BigDecimal price,
        Boolean isAvailable,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        UserResponse user,
        List<String> imageUrls
) {
}
