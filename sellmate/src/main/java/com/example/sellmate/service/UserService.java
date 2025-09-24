package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreateUserRequest;
import com.example.sellmate.dto.request.UpdateUserRequest;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.entity.Follow;
import com.example.sellmate.entity.User;
import com.example.sellmate.entity.Wallet;
import com.example.sellmate.exception.user.EmailAlreadyExistsException;
import com.example.sellmate.exception.user.EmailNotFoundException;
import com.example.sellmate.exception.user.UnauthorizedException;
import com.example.sellmate.exception.user.UserNotFoundException;
import com.example.sellmate.mapper.UserMapper;
import com.example.sellmate.repository.FollowRepository;
import com.example.sellmate.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileUploadService fileUploadService;
    private final FollowRepository followRepository;
    public UserService(UserRepository userRepository, UserMapper userMapper, BCryptPasswordEncoder passwordEncoder, FileUploadService fileUploadService, FollowRepository followRepository){
        this.userRepository=userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileUploadService = fileUploadService;
        this.followRepository = followRepository;
    }

    public UserResponse saveUser(CreateUserRequest request){
        if (userRepository.existsByEmail(request.email())){
            throw new EmailAlreadyExistsException(request.email());
        }
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        if (request.profileImage() != null && !request.profileImage().isEmpty()){
            String imageUrl = fileUploadService.uploadProfileImage(request.profileImage());
            user.setProfileImage(imageUrl);
        }
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        user.setWallet(wallet);
        User newUser = userRepository.save(user);
        return userMapper.toResponse(newUser);
    }
    public List<UserResponse> getUsers(){
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }
    public UserResponse getUser(Long userId){
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        int followers = followRepository.countByFollowingId(user.getId());
        int following = followRepository.countByFollowerId(user.getId());
        return userMapper.toResponse(user, followers, following);
    }
    public UserResponse updateUser(UpdateUserRequest request, Long userId){
        User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
        if (request.email() != null && !request.email().equals(user.getEmail())){
            if (userRepository.existsByEmail(request.email())){
                throw new EmailAlreadyExistsException(request.email());
            }
        }
        userMapper.updateEntityFromRequest(request, user);
        if (request.password() != null){
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        if (request.profileImage() != null && !request.profileImage().isEmpty()){
            if (user.getProfileImage() != null){
                fileUploadService.deleteOldProfileImage(user.getProfileImage());
            }
            String imageUrl = fileUploadService.uploadProfileImage(request.profileImage());
            user.setProfileImage(imageUrl);
        }
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }
    public void deleteUserById(Long userId){
        if (!userRepository.existsById(userId)){
            throw new UserNotFoundException(userId);
        }
        userRepository.deleteById(userId);
    }
    public User getCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()){
            throw new UnauthorizedException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();
        return userRepository.findByEmail(email).orElseThrow(() -> new EmailNotFoundException(email));
    }
    public Long getCurrentUserId(){
        return getCurrentUser().getId();
    }

    public void followUser(Long targetUserId){
        User currentUser = getCurrentUser();
        if (currentUser.getId().equals(targetUserId)){
            throw new UnauthorizedException("You cannot follow yourself");
        }
        if (followRepository.existsByFollowerIdAndFollowingId(currentUser.getId(), targetUserId)) return;
        User target = userRepository.findById(targetUserId).orElseThrow(() -> new UserNotFoundException(targetUserId));
        Follow follow = new Follow();
        follow.setFollower(getCurrentUser());
        follow.setFollowing(target);
        followRepository.save(follow);
    }
    public void unfollowUser(Long targetUserId){
        User currentUser = getCurrentUser();
        followRepository.findByFollowerIdAndFollowingId(currentUser.getId(), targetUserId).ifPresent(followRepository::delete);
    }

    public UserResponse getCurrentUserProfile(){
        User user = getCurrentUser();
        int followers = followRepository.countByFollowingId(user.getId());
        int following = followRepository.countByFollowerId(user.getId());
        return userMapper.toResponse(user, followers, following);
    }
    public List<Long> getFollowingIdsOfCurrentUser(){
        User currentUser = getCurrentUser();
        return followRepository.findAllByFollowerId(currentUser.getId()).stream().map(f -> f.getFollowing().getId()).toList();
    }

    public List<UserResponse> getFollowers(Long userId){
        List<User> followers = followRepository.findAllByFollowingId(userId).stream().map(Follow::getFollower).toList();
        return followers.stream().map(userMapper::toResponse).collect(Collectors.toList());
    }
    public List<UserResponse> getFollowing(Long userId){
        List<User> following = followRepository.findAllByFollowingId(userId).stream().map(Follow::getFollowing).toList();
        return following.stream().map(userMapper::toResponse).collect(Collectors.toList());
    }
    public List<UserResponse> searchUsers(String q){
        String s = q == null ? "" : q.trim();
        if (s.isEmpty()) return List.of();
        List<User> users = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(s, s, s);
        return users.stream().map(userMapper::toResponse).toList();
    }

}
