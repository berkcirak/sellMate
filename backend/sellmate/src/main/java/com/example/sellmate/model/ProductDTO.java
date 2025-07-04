package com.example.sellmate.model;

import com.example.sellmate.entity.Product;
import jakarta.persistence.Lob;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProductDTO {
    public String title;
    @Lob
    public String description;
    public BigDecimal price;
    public String username;
    public LocalDateTime createdTime;

    public ProductDTO(Product product){
        this.title=product.getTitle();
        this.description=product.getDescription();
        this.price=product.getPrice();
        this.createdTime=product.getCreatedAt();
        this.username=product.getOwner().getUsername();
    }
    public ProductDTO(){}


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
