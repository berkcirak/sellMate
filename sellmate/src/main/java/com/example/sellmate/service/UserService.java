package com.example.sellmate.service;

import com.example.sellmate.dto.request.CreateUserRequest;
import com.example.sellmate.dto.request.UpdateUserRequest;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.entity.User;
import com.example.sellmate.exception.user.EmailAlreadyExistsException;
import com.example.sellmate.exception.user.UserNotFoundException;
import com.example.sellmate.mapper.UserMapper;
import com.example.sellmate.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository, UserMapper userMapper, BCryptPasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse saveUser(CreateUserRequest request){
        if (userRepository.existsByEmail(request.email())){
            throw new EmailAlreadyExistsException(request.email());
        }
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
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
        return userMapper.toResponse(user);
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
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }
    public void deleteUserById(Long userId){
        if (!userRepository.existsById(userId)){
            throw new UserNotFoundException(userId);
        }
        userRepository.deleteById(userId);
    }

}
