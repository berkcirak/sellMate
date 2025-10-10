package com.example.sellmate.service;

import com.example.sellmate.dto.response.OrderResponse;
import com.example.sellmate.entity.Order;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.enums.OrderStatus;
import com.example.sellmate.exception.post.PostNotFoundException;
import com.example.sellmate.mapper.OrderMapper;
import com.example.sellmate.repository.OrderRepository;
import com.example.sellmate.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final UserService userService;
    private final PostRepository postRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    public OrderService(UserService userService, PostRepository postRepository, OrderRepository orderRepository, OrderMapper orderMapper) {
        this.userService = userService;
        this.postRepository = postRepository;
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
    }

    @Transactional
    public OrderResponse createOrder(Long postId){
        Long buyerId = userService.getCurrentUserId();
        Post post = postRepository.findByIdForUpdate(postId).orElseThrow(() -> new PostNotFoundException(postId));
        if (!Boolean.TRUE.equals(post.getAvailable())){
            throw new IllegalStateException("Post not available");
        }
        Long sellerId = post.getUser().getId();
        if (buyerId.equals(sellerId)){
            throw new IllegalArgumentException("Cannot buy your own post");
        }
        Order order = new Order();
        order.setPrice(post.getPrice());
        order.setBuyerId(buyerId);
        order.setPostId(postId);
        order.setSellerId(sellerId);
        order.setStatus(OrderStatus.PENDING);
        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }
    


}
