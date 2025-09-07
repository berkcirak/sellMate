package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.CreateCommentRequest;
import com.example.sellmate.dto.request.UpdateCommentRequest;
import com.example.sellmate.dto.response.CommentResponse;
import com.example.sellmate.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;
    public CommentController(CommentService commentService){
        this.commentService=commentService;
    }

    @PostMapping
    public ApiResponse<CommentResponse> createComment(@RequestBody CreateCommentRequest request, HttpServletRequest httpRequest){
        CommentResponse commentResponse = commentService.createComment(request);
        return ApiResponse.success(commentResponse, "Comment created successfully", httpRequest.getRequestURI());
    }
    @GetMapping("/post/{postId}")
    public ApiResponse<List<CommentResponse>> getCommentsByPost(@PathVariable Long postId, HttpServletRequest httpRequest){
        List<CommentResponse> commentResponseList = commentService.getCommentsByPost(postId);
        return ApiResponse.success(commentResponseList, "Comments retrieved successfully by post", httpRequest.getRequestURI());
    }
    @GetMapping("/user/{userId}")
    public ApiResponse<List<CommentResponse>> getCommentsByUser(@PathVariable Long userId, HttpServletRequest httpRequest){
        List<CommentResponse> commentResponseList = commentService.getCommentsByUser(userId);
        return ApiResponse.success(commentResponseList, "Comments retrieved successfully");
    }
    @PutMapping("/{commentId}")
    public ApiResponse<CommentResponse> updateComment(@PathVariable Long commentId, UpdateCommentRequest request, HttpServletRequest httpRequest){
        CommentResponse commentResponse = commentService.updateComment(commentId, request);
        return ApiResponse.success(commentResponse, "Comment updated successfully", httpRequest.getRequestURI());
    }
    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable Long commentId, HttpServletRequest httpRequest){
        commentService.deleteComment(commentId);
        return ApiResponse.success(null, "Comment deleted successfully", httpRequest.getRequestURI());
    }



}
