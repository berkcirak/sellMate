package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.response.OrderResponse;
import com.example.sellmate.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrderController {
    
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @PostMapping("/posts/{postId}")
    public ApiResponse<OrderResponse> createOrder(@PathVariable Long postId, HttpServletRequest httpServletRequest){
        OrderResponse orderResponse = orderService.createOrder(postId);
        return ApiResponse.success(orderResponse, "Order created successfully", httpServletRequest.getRequestURI());
    }
    @PostMapping("/{orderId}/confirm")
    public ApiResponse<OrderResponse> confirmOrder(@PathVariable Long orderId, HttpServletRequest httpServletRequest){
        OrderResponse orderResponse = orderService.confirmDelivery(orderId);
        return ApiResponse.success(orderResponse, "Order confirmed, payment completed", httpServletRequest.getRequestURI());
    }
    @PostMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(@PathVariable Long orderId, HttpServletRequest httpServletRequest){
        OrderResponse orderResponse = orderService.cancelDelivery(orderId);
        return ApiResponse.success(orderResponse, "Order canceled, payment rollback", httpServletRequest.getRequestURI());
    }
}
