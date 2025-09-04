package com.example.sellmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateCommentRequest(
        @NotBlank(message = "Content cannot be blank")
        @Size(min = 1, max = 500, message = "Content must be between 1 and 500 characters")
        String content
) {
}
