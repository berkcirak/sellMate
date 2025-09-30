package com.example.sellmate.repository;

import com.example.sellmate.entity.Conversation;
import com.example.sellmate.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderByCreatedAtDesc(Conversation conversation);
}
