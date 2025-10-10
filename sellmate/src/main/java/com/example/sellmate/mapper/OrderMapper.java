package com.example.sellmate.mapper;

import com.example.sellmate.dto.response.OrderResponse;
import com.example.sellmate.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order){
        return new OrderResponse(
                order.getId(),
                order.getBuyerId(),
                order.getSellerId(),
                order.getPostId(),
                order.getPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt());
    }

}
