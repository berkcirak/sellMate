package com.example.sellmate.mapper;

import com.example.sellmate.dto.request.CreateCommentRequest;
import com.example.sellmate.dto.request.UpdateCommentRequest;
import com.example.sellmate.dto.response.CommentResponse;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.entity.Comment;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public Comment toEntity(CreateCommentRequest request, User user, Post post){
        Comment comment = new Comment();
        comment.setContent(request.content());
        comment.setPost(post);
        comment.setUser(user);
        return comment;
    }
    public CommentResponse toResponse(Comment comment){
        UserResponse userResponse = new UserResponse(
                comment.getUser().getId(),
                comment.getUser().getFirstName(),
                comment.getUser().getLastName(),
                comment.getUser().getEmail(),
                comment.getUser().getProfileImage(),
                0,
                0,
                comment.getUser().getCreatedAt(),
                comment.getUser().getUpdatedAt()
        );
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                userResponse,
                comment.getPost().getId(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
    public void updateEntityFromRequest(UpdateCommentRequest request, Comment comment){
        comment.setContent(request.content());
    }


}
