package com.example.sellmate.mapper;

import com.example.sellmate.dto.response.LikeResponse;
import com.example.sellmate.entity.Like;
import org.springframework.stereotype.Component;

@Component
public class LikeMapper {

    public LikeResponse toResponse(Like like){
        return new LikeResponse(like.getId(),
                like.getUser().getId(),
                like.getUser().getEmail(),
                like.getPost().getId(),
                like.getPost().getTitle(),
                like.getCreatedAt());
    }

}
