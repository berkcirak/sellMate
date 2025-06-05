package com.example.sellmate.service;

import com.example.sellmate.entity.Product;
import com.example.sellmate.entity.User;
import com.example.sellmate.model.ProductDTO;
import com.example.sellmate.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProductService {

    private ProductRepository productRepository;
    private UserService userService;

    public ProductService(ProductRepository productRepository, UserService userService){
        this.productRepository=productRepository;
        this.userService=userService;
    }

    public Product addProduct(Product product){
        User ownerUser = userService.getAuthenticatedUser();
        product.setOwner(ownerUser);
        product.setCreatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

}
