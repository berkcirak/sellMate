package com.example.sellmate.exception.offer;

public class OfferNotFoundException extends RuntimeException{

    public OfferNotFoundException(Long offerId){
        super("Offer not found by id: "+ offerId);
    }

}
