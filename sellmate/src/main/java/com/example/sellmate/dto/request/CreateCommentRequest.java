package com.example.sellmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(
        @NotBlank(message = "Content cannot be blank")
        @Size(min = 1, max = 500, message = "Content must be between 1 and 500 characters")
        String content,
        @NotNull(message = "Post ID cannot be null")
        Long postId
) {
}
