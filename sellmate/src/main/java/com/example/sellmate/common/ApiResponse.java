package com.example.sellmate.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        LocalDateTime timestamp,
        String path
) {
    public static <T> ApiResponse<T> success(T data){
        return new ApiResponse<>(true, "Operation completed successfully",data, LocalDateTime.now(), null);
    }
    public static <T> ApiResponse<T> success(T data, String message){
        return new ApiResponse<>(true, message, data, LocalDateTime.now(), null);
    }
    public static <T> ApiResponse<T> success(T data, String message, String path){
        return new ApiResponse<>(true, message, data, LocalDateTime.now(), path);
    }
    public static <T> ApiResponse<T> error(String message){
        return new ApiResponse<>(false, message, null, LocalDateTime.now(), null);
    }
    public static <T> ApiResponse<T> error(String message, String path){
        return new ApiResponse<>(false, message, null, LocalDateTime.now(), path);
    }


}
