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
    public NotificationService(NotificationRepository notificationRepository, NotificationMapper notificationMapper) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
    }

    @Transactional
    public NotificationResponse createIfNotExist(String eventId, Long recipientId, Long actorId, Long postId,
                                                 Long relatedId, NotificationType type, String message){
        if (notificationRepository.existsByEventId(eventId)){
            return null;
        }
        Notification notification  = new Notification(eventId, recipientId, actorId, postId, type, message);
        Notification savedNotification = notificationRepository.save(notification);
        return notificationMapper.toResponse(savedNotification);
    }
    public List<NotificationResponse> getNotificationsByUserId(Long userId){
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(notificationMapper::toResponse).toList();
    }




}
