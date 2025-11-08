package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreateCommentRequest;
import com.example.sellmate.dto.request.UpdateCommentRequest;
import com.example.sellmate.dto.response.CommentResponse;
import com.example.sellmate.entity.Comment;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.User;
import com.example.sellmate.event.CommentCreatedEvent;
import com.example.sellmate.exception.comment.CommentNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.mapper.CommentMapper;
import com.example.sellmate.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentMapper commentMapper;
    private final UserService userService;
    private final PostService postService;
    private final CommentRepository commentRepository;
    private final DomainEventPublisher domainEventPublisher;

    public CommentService(CommentMapper commentMapper, UserService userService, PostService postService, CommentRepository commentRepository, DomainEventPublisher domainEventPublisher){
        this.commentMapper=commentMapper;
        this.userService=userService;
        this.postService=postService;
        this.commentRepository=commentRepository;
        this.domainEventPublisher = domainEventPublisher;
    }

    public CommentResponse createComment(CreateCommentRequest request){
        User currentUser = userService.getCurrentUser();
        Post post = postService.getPostEntity(request.postId());

        Comment comment = commentMapper.toEntity(request,currentUser,post);
        Comment savedComment = commentRepository.save(comment);
        Long postOwnerId = post.getUser().getId();
        if (!currentUser.getId().equals(postOwnerId)){
            CommentCreatedEvent event = new CommentCreatedEvent(
                    UUID.randomUUID().toString(),
                    post.getId(),
                    postOwnerId,
                    currentUser.getId(),
                    savedComment.getContent(),
                    Instant.now());
            domainEventPublisher.publishComment(event);
        }
        return commentMapper.toResponse(savedComment);
    }
    public List<CommentResponse> getCommentsByPost(Long postId){
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        return comments.stream().map(commentMapper::toResponse).collect(Collectors.toList());
    }
    public List<CommentResponse> getCommentsByUser(Long userId){
        List<Comment> comments = commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return comments.stream().map(commentMapper::toResponse).collect(Collectors.toList());
    }
    public CommentResponse updateComment(Long commentId, UpdateCommentRequest request){
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
        User user = userService.getCurrentUser();
        if (!comment.getUser().getId().equals(user.getId())){
            throw new UnauthorizedException("You are not authorized for update this comment");
        }
        commentMapper.updateEntityFromRequest(request, comment);
        Comment updatedComment = commentRepository.save(comment);
        return commentMapper.toResponse(comment);
    }
    public void deleteComment(Long commentId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
        User user = userService.getCurrentUser();
        if (!comment.getUser().getId().equals(user.getId())){
            throw new UnauthorizedException("You are not authorized for delete this comment");
        }
        commentRepository.delete(comment);
    }

}
