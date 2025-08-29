package com.example.sellmate.mapper;

import com.example.sellmate.dto.request.CreatePostRequest;
import com.example.sellmate.dto.request.UpdatePostRequest;
import com.example.sellmate.dto.response.PostResponse;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.ProductImage;
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
    public PostResponse toResponse(Post post){
        UserResponse userResponse = post.getUser() != null ? userMapper.toResponse(post.getUser()) : null;
        List<String> imageUrls = mapImagesToUrls(post.getImages());
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
    public void updateEntityFromRequest(UpdatePostRequest request, Post post){
        if (request.title() != null){
            post.setTitle(request.title());
        }
        if (request.description() != null){
            post.setDescription(request.title());
        }
        if (request.price() != null){
            post.setPrice(request.price());
        }
        if (request.isAvailable() != null){
            post.setAvailable(request.isAvailable());
        }
    }

    private List<String> mapImagesToUrls(List<ProductImage> images) {
        if (images == null || images.isEmpty()){
            return List.of();
        }
        return images.stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
    }



}
