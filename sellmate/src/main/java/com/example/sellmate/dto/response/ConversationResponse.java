package com.example.sellmate.dto.response;

import java.time.LocalDateTime;

public record ConversationResponse(
        Long id,
        Long userAId,
        Long userBId,
        LocalDateTime createdAt
) {}
