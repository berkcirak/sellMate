package com.example.sellmate.entity;

import com.example.sellmate.entity.base.BaseEntity;
import com.example.sellmate.entity.enums.NotificationType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

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

    public Notification(String eventId, Long recipientId, Long actorId, Long postId, NotificationType type, String message, Boolean isRead) {
        this.eventId = eventId;
        this.recipientId = recipientId;
        this.actorId = actorId;
        this.postId = postId;
        this.type = type;
        this.message = message;
        this.isRead = isRead;
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

    public Boolean getRead() {
        return isRead;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }
}
