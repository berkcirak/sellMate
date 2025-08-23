package com.example.sellmate.dto.response;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String profileImage,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
