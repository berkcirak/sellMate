package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.CreatePostRequest;
import com.example.sellmate.dto.request.UpdatePostRequest;
import com.example.sellmate.dto.response.PostResponse;
import com.example.sellmate.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService){
        this.postService=postService;
    }

    @PostMapping
    public ApiResponse<PostResponse> createPost(@ModelAttribute CreatePostRequest request, HttpServletRequest httpRequest){
        PostResponse post = postService.createPost(request);
        return ApiResponse.success(post, "Post created successfully", httpRequest.getRequestURI());
    }
    @GetMapping
    public ApiResponse<List<PostResponse>> getAllPosts(HttpServletRequest httpRequest){
        List<PostResponse> posts = postService.getPosts();
        return ApiResponse.success(posts, "Posts retrieved successfully", httpRequest.getRequestURI());
    }
    @GetMapping("{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long postId, HttpServletRequest httpRequest){
        PostResponse post = postService.getPost(postId);
        return ApiResponse.success(post, "Post retrieved successfully",httpRequest.getRequestURI());
    }
    @GetMapping("{userId}")
    public ApiResponse<List<PostResponse>> getPostsByUser(@PathVariable Long userId, HttpServletRequest httpRequest){
        List<PostResponse> postList = postService.getPostsByUser(userId);
        return ApiResponse.success(postList, "User posts retrieved successfully", httpRequest.getRequestURI());
    }
    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(@RequestBody UpdatePostRequest request, @PathVariable Long postId, HttpServletRequest httpRequest){
        PostResponse updatedPost = postService.updatePost(postId, request);
        return ApiResponse.success(updatedPost, "Post updated successfully", httpRequest.getRequestURI());
    }
    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable Long postId, HttpServletRequest httpRequest){
        postService.deletePost(postId);
        return ApiResponse.success(null, "Post deleted successfully", httpRequest.getRequestURI());
    }

}
