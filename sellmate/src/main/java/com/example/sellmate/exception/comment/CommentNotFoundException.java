package com.example.sellmate.exception.comment;

public class CommentNotFoundException extends RuntimeException{
    public CommentNotFoundException(Long commentId){
        super("Comment not found by id: " + commentId);
    }
}
