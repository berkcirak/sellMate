package com.example.sellmate.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateConversationRequest(
        @NotBlank
        Long userAId,
        @NotBlank
        Long userBId
) {
}
