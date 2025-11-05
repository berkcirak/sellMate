package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreateLikeRequest;
import com.example.sellmate.dto.response.LikeResponse;
import com.example.sellmate.entity.Like;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.User;
import com.example.sellmate.event.LikeCreatedEvent;
import com.example.sellmate.exception.like.LikeAlreadyExistsException;
import com.example.sellmate.exception.like.LikeNotFoundException;
import com.example.sellmate.exception.post.PostNotFoundException;
import com.example.sellmate.mapper.LikeMapper;
import com.example.sellmate.repository.LikeRepository;
import com.example.sellmate.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserService userService;
    private final PostRepository postRepository;
    private final LikeMapper likeMapper;
    private final DomainEventPublisher eventPublisher;
    public LikeService(LikeRepository likeRepository, UserService userService, PostRepository postRepository, LikeMapper likeMapper, DomainEventPublisher eventPublisher){
        this.likeRepository=likeRepository;
        this.userService=userService;
        this.postRepository=postRepository;
        this.likeMapper=likeMapper;
        this.eventPublisher = eventPublisher;
    }
    public LikeResponse likePost(CreateLikeRequest request){
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(request.postId()).orElseThrow(() -> new PostNotFoundException(request.postId()));
        if (likeRepository.existsByUserAndPost(currentUser, post)){
            throw new LikeAlreadyExistsException("You already liked this post");
        }
        Like like = new Like(currentUser, post);
        Like savedLink = likeRepository.save(like);
        Long postOwnerId = post.getUser().getId();
        if (!currentUser.getId().equals(postOwnerId)){
            LikeCreatedEvent event = new LikeCreatedEvent(UUID.randomUUID().toString(),
                    post.getId(),
                    postOwnerId,
                    currentUser.getId(),
                    Instant.now());
            eventPublisher.publishLike(event);
        }
        return likeMapper.toResponse(savedLink);
    }
    public void unlikePost(Long postId){
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        Like like = likeRepository.findByUserAndPost(currentUser, post).orElseThrow(() -> new LikeNotFoundException("Like not found"));
        likeRepository.delete(like);
    }
    public List<LikeResponse> getPostLikes(Long postId){
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        List<Like> likes = likeRepository.findByPostOrderByCreatedAtDesc(post);
        return likes.stream().map(likeMapper::toResponse).collect(Collectors.toList());
    }
    public List<LikeResponse> getUserLikes() {
        User currentUser = userService.getCurrentUser();
        List<Like> likes = likeRepository.findByUserOrderByCreatedAtDesc(currentUser);
        return likes.stream().map(likeMapper::toResponse).collect(Collectors.toList());
    }
    public long getPostLikeCount(Long postId){
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        return likeRepository.countByPost(post);
    }
    public List<LikeResponse> getUserLikesById(Long userId){
        List<Like> likes = likeRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return likes.stream().map(likeMapper::toResponse).toList();
    }


}
