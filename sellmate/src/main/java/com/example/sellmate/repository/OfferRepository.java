package com.example.sellmate.repository;

import com.example.sellmate.entity.Offer;
import com.example.sellmate.entity.enums.OfferStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByPostIdAndStatus(Long postId, OfferStatus status);
}
