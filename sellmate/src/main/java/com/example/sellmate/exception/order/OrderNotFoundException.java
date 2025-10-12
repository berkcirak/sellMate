package com.example.sellmate.exception.order;

public class OrderNotFoundException extends RuntimeException{

    public OrderNotFoundException(Long orderId){
        super("Order cannot found by id: " + orderId);
    }

}
