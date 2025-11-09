package com.example.sellmate.service;

import com.example.sellmate.dto.response.NotificationResponse;
import com.example.sellmate.entity.enums.NotificationType;
import com.example.sellmate.event.*;
import com.example.sellmate.repository.UserRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class NotificationConsumer {

    private final RealTimeNotifier realTimeNotifier;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public NotificationConsumer(RealTimeNotifier realTimeNotifier, UserRepository userRepository, NotificationService notificationService) {
        this.realTimeNotifier = realTimeNotifier;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    private String fullName(Long userId){
        return userRepository.findById(userId)
                .map(u -> (u.getFirstName() + " " + u.getLastName()).trim())
                .orElse("Bilinmeyen kullanıcı");
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onLike(LikeCreatedEvent e){
        String name = fullName(e.actorUserId());
        String message = name + " gönderini beğendi.";
        NotificationResponse payload = notificationService.createIfNotExist(
                e.eventId(),
                e.postOwnerId(),
                e.actorUserId(),
                e.postId(),
                NotificationType.LIKE,
                message);
        if (payload != null){
            realTimeNotifier.pushToUser(e.postOwnerId(), payload);
        }
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onComment(CommentCreatedEvent e){
        String name = fullName(e.actorUserId());
        String message = name + " gönderine yorum yaptı.";
        NotificationResponse payload = notificationService.createIfNotExist(
                e.eventId(),
                e.postOwnerId(),
                e.actorUserId(),
                e.postId(),
                NotificationType.COMMENT,
                message
        );
        if (payload != null){
            realTimeNotifier.pushToUser(e.postOwnerId(), payload);
        }
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onOrder(OrderPlacedEvent e){
        String name = fullName(e.actorUserId());
        String message = name + " gönderin için sipariş verdi.";
        NotificationResponse payload = notificationService.createIfNotExist(
                e.eventId(),
                e.postOwnerId(),
                e.actorUserId(),
                e.postId(),
                NotificationType.ORDER,
                message
        );
        if (payload != null){
            realTimeNotifier.pushToUser(e.postOwnerId(), payload);
        }
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onOfferCreated(OfferCreatedEvent e){
        String name = fullName(e.bidderUserId());
        String message = name + " gönderin için bir teklif verdi.";
        NotificationResponse payload = notificationService.createIfNotExist(
                e.eventId(),
                e.postOwnerId(),
                e.bidderUserId(),
                e.postId(),
                NotificationType.OFFER_CREATED,
                message
        );
        if (payload != null){
            realTimeNotifier.pushToUser(e.postOwnerId(), payload);
        }
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onOfferDecision(OfferDecisionEvent e){
        String name = fullName(e.postOwnerId());
        String message = e.decision() == NotificationType.OFFER_ACCEPTED
                ? name + " teklifini kabul etti"
                : name + " teklifini reddetti";
        NotificationResponse payload = notificationService.createIfNotExist(
                e.eventId(),
                e.bidderUserId(),
                e.postOwnerId(),
                e.postId(),
                e.decision(),
                message
        );
        if (payload != null){
            realTimeNotifier.pushToUser(e.bidderUserId(), payload);
        }
    }

}
