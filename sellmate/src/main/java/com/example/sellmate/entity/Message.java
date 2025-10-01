package com.example.sellmate.entity;

import com.example.sellmate.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Size;

@Entity
public class Message  extends BaseEntity {

    @ManyToOne(optional = false)
    private Conversation conversation;
    @Column(nullable = false)
    private Long senderId;
    @Column(columnDefinition = "TEXT", nullable = false)
    @Size(max = 1000)
    private String content;

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
