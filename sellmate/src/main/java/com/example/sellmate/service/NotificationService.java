package com.example.sellmate.service;

import com.example.sellmate.dto.response.NotificationResponse;
import com.example.sellmate.entity.Notification;
import com.example.sellmate.entity.enums.NotificationType;
import com.example.sellmate.mapper.NotificationMapper;
import com.example.sellmate.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UserService userService;
    public NotificationService(NotificationRepository notificationRepository, NotificationMapper notificationMapper, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
        this.userService = userService;
    }

    @Transactional
    public NotificationResponse createIfNotExist(String eventId, Long recipientId, Long actorId, Long postId,
                                                  NotificationType type, String message){
        if (notificationRepository.existsByEventId(eventId)){
            return null;
        }
        Notification notification  = new Notification(eventId, recipientId, actorId, postId, type, message);
        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toResponse(savedNotification);
    }
    public List<NotificationResponse> getNotificationsByUserId(){
        Long userId = userService.getCurrentUserId();
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(notificationMapper::toResponse).toList();
    }
    public long getUnreadCount(){
        Long userId = userService.getCurrentUserId();
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }
    @Transactional
    public void markAsRead(Long notificationId){
        Long userId = userService.getCurrentUserId();
        notificationRepository.findByIdAndRecipientId(notificationId, userId)
                .ifPresent(notification -> {
                    notification.setIsRead(true);
                    notificationRepository.save(notification);
                });
    }
    @Transactional
    public void markAllAsRead(){
        Long userId = userService.getCurrentUserId();
        List<Notification> unread = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(n -> !n.getIsRead())
                .toList();
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }


}
