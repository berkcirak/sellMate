package com.example.sellmate.service;

import com.example.sellmate.dto.response.OrderResponse;
import com.example.sellmate.entity.Order;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.Wallet;
import com.example.sellmate.entity.enums.OrderStatus;
import com.example.sellmate.exception.order.OrderNotFoundException;
import com.example.sellmate.exception.post.PostNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.exception.wallet.WalletNotFoundException;
import com.example.sellmate.mapper.OrderMapper;
import com.example.sellmate.repository.OrderRepository;
import com.example.sellmate.repository.PostRepository;
import com.example.sellmate.repository.WalletRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final UserService userService;
    private final PostRepository postRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final WalletRepository walletRepository;
    public OrderService(UserService userService, PostRepository postRepository, OrderRepository orderRepository, OrderMapper orderMapper, WalletRepository walletRepository) {
        this.userService = userService;
        this.postRepository = postRepository;
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.walletRepository = walletRepository;
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
        Wallet buyer = walletRepository.findByUserIdForUpdate(order.getBuyerId()).orElseThrow(() -> new WalletNotFoundException("Buyer wallet not found"));
        buyer.reserve(post.getPrice());
        order.setStatus(OrderStatus.RESERVED);
        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void moveReservedToDeliveryPending(){
        LocalDateTime cutoff = LocalDateTime.now().minusDays(2);
        List<Order> list = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.RESERVED, cutoff);
        for (Order order: list){
            order.setStatus(OrderStatus.PENDING);
        }
    }
    @Transactional
    public OrderResponse confirmDelivery(Long orderId){
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException(orderId));
        Long currentUserId = userService.getCurrentUserId();
        if (!order.getBuyerId().equals(currentUserId)){
            throw new UnauthorizedException("Only buyer can confirm");
        }
        if (order.getStatus() != OrderStatus.PENDING){
            throw new IllegalStateException("Invalid state");
        }
        Wallet buyer = walletRepository.findByUserIdForUpdate(order.getBuyerId()).orElseThrow(() -> new WalletNotFoundException("Buyer wallet not found"));
        Wallet seller = walletRepository.findByUserIdForUpdate(order.getSellerId()).orElseThrow(() -> new WalletNotFoundException("Seller wallet not found"));
        buyer.capture(order.getPrice());
        seller.deposit(order.getPrice());
        Post post = postRepository.findByIdForUpdate(order.getPostId()).orElseThrow(() -> new IllegalArgumentException("Post not found"));
        post.setAvailable(false);
        order.setStatus(OrderStatus.COMPLETED);
        Order saved = orderRepository.save(order);
        return orderMapper.toResponse(saved);
    }
    @Transactional
    public OrderResponse cancelDelivery(Long orderId){
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException(orderId));
        Long currentUserId = userService.getCurrentUserId();
        if (!order.getBuyerId().equals(currentUserId)){
            throw new UnauthorizedException("Only buyer can cancel");
        }
        if (order.getStatus() != OrderStatus.PENDING){
            throw new IllegalStateException("Invalid state");
        }
        Wallet buyer = walletRepository.findByUserIdForUpdate(currentUserId).orElseThrow(() -> new WalletNotFoundException("Buyer wallet not found"));
        buyer.release(order.getPrice());
        order.setStatus(OrderStatus.CANCELED);
        Order saved = orderRepository.save(order);
        return orderMapper.toResponse(saved);
    }



}
