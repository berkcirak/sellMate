package com.example.sellmate.repository;

import com.example.sellmate.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByUserAIdAndUserBId(Long userAId, Long userBId);
    List<Conversation> findByUserAIdOrUserBId(Long userAId, Long userBId);
}
