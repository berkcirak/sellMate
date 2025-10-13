package com.example.sellmate.mapper;

import com.example.sellmate.dto.response.OfferResponse;
import com.example.sellmate.entity.Offer;
import org.springframework.stereotype.Component;

@Component
public class OfferMapper {

    public OfferResponse toResponse(Offer offer){
        return new OfferResponse(
                offer.getId(),
                offer.getBuyerId(),
                offer.getPostId(),
                offer.getOfferedPrice(),
                offer.getStatus(),
                offer.getCreatedAt(),
                offer.getUpdatedAt()
        );
    }



}
