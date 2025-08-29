package com.example.sellmate.exception.post;

public class PostNotFoundException extends RuntimeException{
    public PostNotFoundException(Long postId){
        super("Post not found by id: " + postId);
    }
}
