package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreatePostRequest;
import com.example.sellmate.dto.request.UpdatePostRequest;
import com.example.sellmate.dto.response.PostResponse;
import com.example.sellmate.entity.Comment;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.User;
import com.example.sellmate.exception.comment.CommentNotFoundException;
import com.example.sellmate.exception.post.PostNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.mapper.PostMapper;
import com.example.sellmate.repository.CommentRepository;
import com.example.sellmate.repository.PostRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final UserService userService;
    private final PostMapper postMapper;
    private final PostRepository postRepository;
    private final FileUploadService fileUploadService;
    private final CommentRepository commentRepository;
    public PostService(UserService userService, PostMapper postMapper, PostRepository postRepository, FileUploadService fileUploadService, CommentRepository commentRepository){
        this.userService=userService;
        this.postMapper=postMapper;
        this.postRepository=postRepository;
        this.fileUploadService = fileUploadService;
        this.commentRepository = commentRepository;
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
    public List<PostResponse> getFeed(int page, int size){
        List<Long> followingIds = userService.getFollowingIdsOfCurrentUser();
        if (followingIds.isEmpty()) return List.of();
        PageRequest pageRequest = PageRequest.of(page, size);
        var pagePosts = postRepository.findByUserIdInOrderByCreatedAtDesc(followingIds, pageRequest);
        return pagePosts.getContent().stream().map(postMapper::toResponse).toList();
    }
    public List<PostResponse> searchPosts(String q){
        String s = q == null ? "" : q.trim();
        if (s.isEmpty()) return List.of();
        List<Post> posts = postRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(s, s);
        return posts.stream().map(postMapper::toResponse).toList();
    }
    public PostResponse getPostByCommentId(Long commentId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException(commentId));
        Post post = comment.getPost();
        return postMapper.toResponse(post);
    }

}
