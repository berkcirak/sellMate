package com.example.sellmate.repository;

import com.example.sellmate.entity.Like;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    boolean existsByUserAndPost(User user, Post post);
    Optional<Like> findByUserAndPost(User user, Post post);
    List<Like> findByPostOrderByCreatedAtDesc(Post post);
    List<Like> findByUserOrderByCreatedAtDesc(User user);
    long countByPost(Post post);
}
