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

    public Product updateProduct(ProductDTO product, int productId){
        User user = userService.getAuthenticatedUser();
        Product theProduct = productRepository.findById(productId).orElseThrow(()-> new RuntimeException("Product not found"));
        if (user.getId() != theProduct.getOwner().getId()){
            throw new RuntimeException("You are not authorized for update this product");
        }
        if (product.getTitle() != null){
            theProduct.setTitle(product.getTitle());
        }
        if (product.getDescription() != null){
            theProduct.setDescription(product.getDescription());
        }
        if (product.getPrice() != null){
            theProduct.setPrice(product.getPrice());
        }
        return productRepository.save(theProduct);
    }
    public void deleteProduct(int productId){
        User user = userService.getAuthenticatedUser();
        Product product = productRepository.findById(productId).orElseThrow(()->new RuntimeException("Product not found"));
        if (user.getId() != product.getOwner().getId()){
            throw new RuntimeException("You are not authorized for delete this product");
        }
        productRepository.deleteById(productId);
    }
}
