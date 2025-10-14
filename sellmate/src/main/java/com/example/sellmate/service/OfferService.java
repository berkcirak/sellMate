package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreateOfferRequest;
import com.example.sellmate.dto.response.OfferResponse;
import com.example.sellmate.dto.response.OrderResponse;
import com.example.sellmate.entity.Offer;
import com.example.sellmate.entity.Post;
import com.example.sellmate.entity.enums.OfferStatus;
import com.example.sellmate.exception.offer.OfferNotFoundException;
import com.example.sellmate.exception.post.PostNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.mapper.OfferMapper;
import com.example.sellmate.repository.OfferRepository;
import com.example.sellmate.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OfferService {

    private final UserService userService;
    private final PostRepository postRepository;
    private final OfferRepository offerRepository;
    private final OfferMapper offerMapper;
    private final OrderService orderService;

    public OfferService(UserService userService, PostRepository postRepository, OfferRepository offerRepository, OfferMapper offerMapper, OrderService orderService) {
        this.userService = userService;
        this.postRepository = postRepository;
        this.offerRepository = offerRepository;
        this.offerMapper = offerMapper;
        this.orderService = orderService;
    }


    @Transactional
    public OfferResponse createOffer(Long postId, CreateOfferRequest request){
        Long buyerId = userService.getCurrentUserId();
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException(postId));
        if (buyerId.equals(post.getUser().getId())){
            throw new IllegalArgumentException("Cannot offer on your own post");
        }
        if (request.price() == null || request.price().signum() < 0){
            throw new IllegalArgumentException("Invalid offer price");
        }
        Offer offer = new Offer();
        offer.setOfferedPrice(request.price());
        offer.setBuyerId(buyerId);
        offer.setStatus(OfferStatus.PENDING);
        offer.setPostId(postId);
        Offer savedOffer = offerRepository.save(offer);
        return offerMapper.toResponse(savedOffer);
    }
    @Transactional
    public OfferResponse rejectOffer(Long offerId){
        Offer offer = offerRepository.findById(offerId).orElseThrow(() -> new OfferNotFoundException(offerId));
        Post post = postRepository.findById(offer.getPostId()).orElseThrow(() -> new PostNotFoundException(offer.getPostId()));
        Long currentUserId = userService.getCurrentUserId();
        if (!post.getUser().getId().equals(currentUserId)){
            throw new UnauthorizedException("Only post owner can reject offer");
        }
        if (offer.getStatus() != OfferStatus.PENDING){
            throw new IllegalStateException("Offer is not pending");
        }
        offer.setStatus(OfferStatus.REJECTED);
        return offerMapper.toResponse(offerRepository.save(offer));
    }
    @Transactional
    public OrderResponse acceptOffer(Long offerId){
        return orderService.createOrderFromOffer(offerId);
    }




}
