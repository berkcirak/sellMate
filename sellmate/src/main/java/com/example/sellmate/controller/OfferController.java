package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.CreateOfferRequest;
import com.example.sellmate.dto.response.OfferResponse;
import com.example.sellmate.dto.response.OrderResponse;
import com.example.sellmate.service.OfferService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }
    @PostMapping("/posts/{postId}")
    public ApiResponse<OfferResponse> createOffer(@PathVariable Long postId, @RequestBody CreateOfferRequest request, HttpServletRequest httpServletRequest){
        OfferResponse offerResponse = offerService.createOffer(postId,request);
        return ApiResponse.success(offerResponse, "Offer created successfully", httpServletRequest.getRequestURI());
    }
    @PostMapping("/{offerId}/accept")
    public ApiResponse<OrderResponse> acceptOffer(@PathVariable Long offerId, HttpServletRequest httpServletRequest){
        OrderResponse orderResponse = offerService.acceptOffer(offerId);
        return ApiResponse.success(orderResponse, "Offer accepted", httpServletRequest.getRequestURI());
    }
    @PostMapping("{offerId}/reject")
    public ApiResponse<OfferResponse> rejectOffer(@PathVariable Long offerId, HttpServletRequest httpServletRequest){
        OfferResponse offerResponse = offerService.rejectOffer(offerId);
        return ApiResponse.success(offerResponse, "Offer rejected", httpServletRequest.getRequestURI());
    }


}
