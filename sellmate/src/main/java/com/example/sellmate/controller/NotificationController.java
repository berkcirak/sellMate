package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.response.NotificationResponse;
import com.example.sellmate.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;


    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
       }
    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMyNotifications(HttpServletRequest httpServletRequest){
        List<NotificationResponse> notificationResponses = notificationService.getNotificationsByUserId();
        return ApiResponse.success(notificationResponses, "Notifications retrieved successfully", httpServletRequest.getRequestURI());
    }
    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(HttpServletRequest httpServletRequest){
        long count = notificationService.getUnreadCount();
        return ApiResponse.success(count, "Unread notification count", httpServletRequest.getRequestURI());
    }
    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id, HttpServletRequest httpServletRequest){
        notificationService.markAsRead(id);
        return ApiResponse.success(null, "Notification marked as read", httpServletRequest.getRequestURI());
    }
    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllAsRead(HttpServletRequest httpServletRequest){
        notificationService.markAllAsRead();
        return ApiResponse.success(null, "All notifications marked as read", httpServletRequest.getRequestURI());
    }


}
