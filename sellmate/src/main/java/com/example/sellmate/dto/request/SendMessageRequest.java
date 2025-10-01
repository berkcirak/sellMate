package com.example.sellmate.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
        Long conversationId,
        @NotBlank
        @Size(max = 1000)
        String content
) {
}
