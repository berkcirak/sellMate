package com.example.sellmate.controller;

import com.example.sellmate.entity.Product;
import com.example.sellmate.model.ProductDTO;
import com.example.sellmate.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/product")
public class ProductController {


    private ProductService productService;
    public ProductController(ProductService productService){
        this.productService=productService;
    }

    @PostMapping("/add")
    public Product addProduct(@RequestBody Product product){
        return productService.addProduct(product);
    }

    @GetMapping("/list")
    public List<Product> getProducts(){
        return productService.getProducts();
    }
    @GetMapping("/{productId}")
    public Optional<Product> getProductById(@PathVariable int productId){
        return productService.getProductById(productId);
    }
    @GetMapping("/my")
    public List<ProductDTO> getProductsByOwner(){
        return productService.getProductsByOwner();
    }
    @PutMapping("/update/{productId}")
    public ProductDTO updateProduct(@RequestBody ProductDTO product, @PathVariable int productId){
        return productService.updateProduct(product,productId);
    }
    @DeleteMapping("/delete/{productId}")
    public void deleteProduct(@PathVariable int productId){
        productService.deleteProduct(productId);
    }

}
