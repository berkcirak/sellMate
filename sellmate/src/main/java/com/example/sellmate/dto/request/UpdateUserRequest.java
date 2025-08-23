package com.example.sellmate.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        String firstName,
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        String lastName,
        @Email(message = "Email should be valid")
        String email,
        String profileImage,
        @Size(min = 4, message = "Password must be at least 4 characters")
        String password
) {
}
