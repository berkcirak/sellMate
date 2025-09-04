package com.example.sellmate.dto.response;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String content,
        UserResponse user,
        Long postId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
