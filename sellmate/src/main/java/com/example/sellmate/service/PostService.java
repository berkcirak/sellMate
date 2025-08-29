package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreatePostRequest;
import com.example.sellmate.dto.response.PostResponse;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.User;
import com.example.sellmate.mapper.PostMapper;
import com.example.sellmate.repository.PostRepository;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final UserService userService;
    private final PostMapper postMapper;
    private final PostRepository postRepository;
    public PostService(UserService userService, PostMapper postMapper, PostRepository postRepository){
        this.userService=userService;
        this.postMapper=postMapper;
        this.postRepository=postRepository;
    }

    public PostResponse createPost(CreatePostRequest request){
        User user = userService.getCurrentUser();
        Post post = postMapper.toEntity(request);
        post.setUser(user);
        Post savedPost = postRepository.save(post);
        return postMapper.toResponse(savedPost);
    }



}
