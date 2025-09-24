package com.example.sellmate.mapper;

import com.example.sellmate.dto.request.CreateUserRequest;
import com.example.sellmate.dto.request.UpdateUserRequest;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {



    public User toEntity(CreateUserRequest userRequest){
        User user = new User();
        user.setEmail(userRequest.email());
        user.setFirstName(userRequest.firstName());
        user.setLastName(userRequest.lastName());
        user.setPassword(userRequest.password());
        return user;
    }
    public UserResponse toResponse(User user){
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getProfileImage(),
                0,
                0,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
    public UserResponse toResponse(User user, int followerCount, int followingCount){
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getProfileImage(),
                followerCount,
                followingCount,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
    public void updateEntityFromRequest(UpdateUserRequest request, User user){
        if (request.firstName() != null){
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null){
            user.setLastName(request.lastName());
        }
        if (request.email() != null){
            user.setEmail(request.email());
        }
        if (request.password() != null){
            user.setPassword(request.password());
        }
    }

}
