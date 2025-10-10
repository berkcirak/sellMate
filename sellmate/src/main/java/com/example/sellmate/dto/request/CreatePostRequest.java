package com.example.sellmate.dto.request;

import com.example.sellmate.entity.enums.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public record CreatePostRequest(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 70)
        String title,
        @NotBlank(message = "Description is required")
        @Size(min = 10, message = "Description must be at least 10 characters")
        String description,
        @NotNull(message = "Prince is required")
        @DecimalMin(value= "0.01", message = "Price must be greater than 0")
        BigDecimal price,
        @NotNull Category category,
        List<MultipartFile> images
) {
}
