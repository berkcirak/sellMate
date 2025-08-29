package com.example.sellmate.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdatePostRequest(
        @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
        String title,
        @Size(min = 10, message = "Description must be at least 10 characters")
        String description,
        @DecimalMin(value= "0.01", message = "Price must be greater than 0")
        BigDecimal price,
        Boolean isAvailable
) {
}
