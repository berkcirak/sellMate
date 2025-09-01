package com.example.sellmate.mapper;

import com.example.sellmate.dto.request.CreatePostRequest;
import com.example.sellmate.dto.request.UpdatePostRequest;
import com.example.sellmate.dto.response.PostResponse;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.entity.Post;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PostMapper {
    private final UserMapper userMapper;

    public PostMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public Post toEntity(CreatePostRequest request){
        Post post = new Post();
        post.setTitle(request.title());
        post.setAvailable(true);
        post.setDescription(request.description());
        post.setPrice(request.price());
        return post;
    }
    public PostResponse toResponse(Post post, List<String> imageUrls){
        UserResponse userResponse = post.getUser() != null ? userMapper.toResponse(post.getUser()) : null;

        return new PostResponse(post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getPrice(),
                post.getAvailable(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                userResponse,
                imageUrls
                );
    }
    public PostResponse toResponse(Post post){
        return toResponse(post, post.getImageUrls());
    }
    public void updateEntityFromRequest(UpdatePostRequest request, Post post){
        if (request.title() != null){
            post.setTitle(request.title());
        }
        if (request.description() != null){
            post.setDescription(request.description());
        }
        if (request.price() != null){
            post.setPrice(request.price());
        }
        if (request.isAvailable() != null){
            post.setAvailable(request.isAvailable());
        }
    }





}
