package com.example.sellmate.service;

import com.example.sellmate.entity.Product;
import com.example.sellmate.entity.User;
import com.example.sellmate.model.ProductDTO;
import com.example.sellmate.repository.ProductRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public List<Product> getProducts(){
        return productRepository.findAll();
    }
    public Optional<Product> getProductById(int productId){
        return productRepository.findById(productId);
    }
    public List<ProductDTO> getProductsByOwner(){
        User user = userService.getAuthenticatedUser();
        List<Product> products = productRepository.findAllByOwnerId(user.getId());
        return products.stream()
                .map(ProductDTO::new)
                .collect(Collectors.toList());
    }

    public ProductDTO updateProduct(ProductDTO product, int productId){
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
        productRepository.save(theProduct);
        return new ProductDTO(theProduct);
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
