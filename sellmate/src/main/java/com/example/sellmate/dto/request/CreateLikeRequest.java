package com.example.sellmate.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateLikeRequest(
        @NotNull(message = "Post ID is required")
        Long postId
) {
}
