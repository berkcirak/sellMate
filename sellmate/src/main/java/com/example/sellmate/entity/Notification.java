package com.example.sellmate.entity;

import com.example.sellmate.entity.base.BaseEntity;
import com.example.sellmate.entity.enums.NotificationType;
import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

    @Column(nullable = false, updatable = false, unique = true)
    private String eventId;
    @Column(nullable = false)
    private Long recipientId;
    @Column(nullable = false)
    private Long actorId;
    @Column(nullable = false)
    private Long postId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    @Column(nullable = false, length = 300)
    private String message;
    @Column(nullable = false)
    private Boolean isRead = false;
    public Notification(){}

    public Notification(String eventId, Long recipientId, Long actorId, Long postId, NotificationType type, String message) {
        this.eventId = eventId;
        this.recipientId = recipientId;
        this.actorId = actorId;
        this.postId = postId;
        this.type = type;
        this.message = message;
        this.isRead = false;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public Long getActorId() {
        return actorId;
    }

    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean read) {
        isRead = read;
    }
}
