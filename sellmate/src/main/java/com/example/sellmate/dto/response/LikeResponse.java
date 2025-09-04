package com.example.sellmate.dto.response;

import java.time.LocalDateTime;

public record LikeResponse(
        Long id,
        Long userId,
        String userEmail,
        Long postId,
        String postTitle,
        LocalDateTime createdAt
) {
}
