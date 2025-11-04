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

    public NotificationConsumer(RealTimeNotifier realTimeNotifier, UserRepository userRepository) {
        this.realTimeNotifier = realTimeNotifier;
        this.userRepository = userRepository;
    }
    private String fullName(Long userId){
        return userRepository.findById(userId)
                .map(u -> (u.getFirstName() + " " + u.getLastName()).trim())
                .orElse("Bilinmeyen kullanıcı");
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onLike(LikeCreatedEvent e){
        String name = fullName(e.actorUserId());
        NotificationResponse payload = new NotificationResponse(e.eventId(), NotificationType.LIKE,
                name + " gönderini beğendi.", e.actorUserId(), e.postId(), Instant.now());
        realTimeNotifier.pushToUser(e.postOwnerId(), payload);
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onComment(CommentCreatedEvent e){
        String name = fullName(e.actorUserId());
        NotificationResponse payload = new NotificationResponse(e.eventId(), NotificationType.COMMENT,
                name+" gönderine yorum yaptı.", e.actorUserId(), e.postId(), Instant.now());
        realTimeNotifier.pushToUser(e.postOwnerId(), payload);
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onOrder(OrderPlacedEvent e){
        String name = fullName(e.actorUserId());
        NotificationResponse payload = new NotificationResponse(e.eventId(), NotificationType.ORDER,
                name+" gönderin için sipariş verdi.", e.actorUserId(), e.postId(), Instant.now());
        realTimeNotifier.pushToUser(e.postOwnerId(), payload);
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onOfferCreated(OfferCreatedEvent e){
        String name = fullName(e.bidderUserId());
        NotificationResponse payload = new NotificationResponse(e.eventId(), NotificationType.OFFER_CREATED,
                name+" gönderin için bir teklif verdi: " + e.amount(), e.bidderUserId(), e.postId(), Instant.now());
        realTimeNotifier.pushToUser(e.postOwnerId(), payload);
    }
    @RabbitListener(queues = "notification.service.queue")
    public void onOfferDecision(OfferDecisionEvent e){
        String name = fullName(e.postOwnerId());
        String message = e.decision() == NotificationType.OFFER_ACCEPTED
                ? name + " teklifini kabul etti"
                : name + " teklifini reddetti";
        NotificationResponse payload = new NotificationResponse(e.eventId(), e.decision(), message,
                e.postOwnerId(), e.postId(), Instant.now());
        realTimeNotifier.pushToUser(e.postOwnerId(), payload);
    }

}
