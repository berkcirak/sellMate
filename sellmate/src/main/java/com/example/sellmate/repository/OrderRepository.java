package com.example.sellmate.repository;

import com.example.sellmate.entity.Order;
import com.example.sellmate.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime before);

}
