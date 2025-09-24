package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.CreateLikeRequest;
import com.example.sellmate.dto.response.LikeResponse;
import com.example.sellmate.service.LikeService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ApiResponse<LikeResponse> likePost(@RequestBody CreateLikeRequest request, HttpServletRequest httpRequest){
        LikeResponse like = likeService.likePost(request);
        return ApiResponse.success(like, "Post liked successfully", httpRequest.getRequestURI());
    }
    @DeleteMapping("/posts/{postId}")
    public ApiResponse<Void> unlikePost(@PathVariable Long postId, HttpServletRequest httpRequest){
        likeService.unlikePost(postId);
        return ApiResponse.success(null, "Post unliked successfully", httpRequest.getRequestURI());
    }
    @GetMapping("/posts/{postId}")
    public ApiResponse<List<LikeResponse>> getPostLikes(@PathVariable Long postId, HttpServletRequest httpRequest){
        List<LikeResponse> likes = likeService.getPostLikes(postId);
        return ApiResponse.success(likes, "Post likes retrieved successfully", httpRequest.getRequestURI());
    }
    @GetMapping("/my-likes")
    public ApiResponse<List<LikeResponse>> getMyLikes(HttpServletRequest httpRequest){
        List<LikeResponse> likes = likeService.getUserLikes();
        return ApiResponse.success(likes, "User likes retrieved successfully", httpRequest.getRequestURI());
    }
    @GetMapping("/posts/{postId}/count")
    public ApiResponse<Long> getPostLikeCount(@PathVariable Long postId, HttpServletRequest httpRequest){
        long count = likeService.getPostLikeCount(postId);
        return ApiResponse.success(count, "Post like count retrieved successfully", httpRequest.getRequestURI());
    }
    @GetMapping("/{userId}")
    public ApiResponse<List<LikeResponse>> getUserLikesById(@PathVariable Long userId, HttpServletRequest httpServletRequest){
        List<LikeResponse> likeResponses = likeService.getUserLikesById(userId);
        return ApiResponse.success(likeResponses, "User likes retrieved successfully", httpServletRequest.getRequestURI());
    }
    


}
