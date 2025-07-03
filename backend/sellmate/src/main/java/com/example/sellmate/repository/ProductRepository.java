package com.example.sellmate.repository;

import com.example.sellmate.entity.Product;
import com.example.sellmate.model.ProductDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    ProductDTO save(ProductDTO productDTO);
    List<Product> findAllByOwnerId(int ownerId);

}
