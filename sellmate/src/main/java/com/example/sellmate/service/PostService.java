package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreatePostRequest;
import com.example.sellmate.dto.request.UpdatePostRequest;
import com.example.sellmate.dto.response.PostResponse;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.User;
import com.example.sellmate.exception.post.PostNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.mapper.PostMapper;
import com.example.sellmate.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final UserService userService;
    private final PostMapper postMapper;
    private final PostRepository postRepository;
    private final FileUploadService fileUploadService;

    public PostService(UserService userService, PostMapper postMapper, PostRepository postRepository, FileUploadService fileUploadService){
        this.userService=userService;
        this.postMapper=postMapper;
        this.postRepository=postRepository;
        this.fileUploadService = fileUploadService;
    }

    public PostResponse createPost(CreatePostRequest request){
        User user = userService.getCurrentUser();
        Post post = postMapper.toEntity(request);
        post.setUser(user);
        List<String> imageUrls = fileUploadService.uploadImages(request.images());
        post.setImageUrls(imageUrls);
        Post savedPost = postRepository.save(post);
        return postMapper.toResponse(savedPost, imageUrls);
    }
    public PostResponse getPost(Long postId){
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        return postMapper.toResponse(post);
    }
    public List<PostResponse> getPosts(){
        List<Post> postList = postRepository.findAll();
        return postList.stream().map(postMapper::toResponse).collect(Collectors.toList());
    }
    public List<PostResponse> getPostsByUser(Long userId){
        List<Post> postList = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return postList.stream().map(postMapper::toResponse).collect(Collectors.toList());
    }
    public PostResponse updatePost(Long postId, UpdatePostRequest request){
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        User currentUser = userService.getCurrentUser();
        if (!post.getUser().getId().equals(currentUser.getId())){
            throw new UnauthorizedException("You are not authorized for update this post");
        }
        postMapper.updateEntityFromRequest(request, post);
        Post updatedPost = postRepository.save(post);
        return postMapper.toResponse(updatedPost);
    }
    public void deletePost(Long postId){
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        User currentUser = userService.getCurrentUser();
        if (!post.getUser().getId().equals(currentUser.getId())){
            throw new UnauthorizedException("You are not authorized for delete this post");
        }
        postRepository.delete(post);
    }
    public Post getPostEntity(Long postId){
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        return post;
    }


}
