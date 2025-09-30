package com.example.sellmate.dto.response;

import java.time.LocalDateTime;

public record MessageResponse(Long id, Long conversationId, Long senderId, String content, LocalDateTime createdAt) {
}
