package com.example.sellmate.dto.response;

import com.example.sellmate.entity.enums.Category;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
        Long id,
        String title,
        String description,
        Category category,
        BigDecimal price,
        Boolean isAvailable,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        UserResponse user,
        List<String> imageUrls
) {
}
