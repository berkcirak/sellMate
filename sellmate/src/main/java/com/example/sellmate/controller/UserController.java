package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.CreateUserRequest;
import com.example.sellmate.dto.request.UpdateUserRequest;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ApiResponse<UserResponse> saveUser(@RequestBody CreateUserRequest request, HttpServletRequest httpRequest){
        UserResponse userResponse = userService.saveUser(request);
        return ApiResponse.success(userResponse, "User created successfully", httpRequest.getRequestURI());
    }
    @GetMapping
    public ApiResponse<List<UserResponse>> getUsers(HttpServletRequest httpRequest){
        List<UserResponse> users = userService.getUsers();
        return ApiResponse.success(users,"Users retrieved successfully", httpRequest.getRequestURI());
    }
    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getUser(@PathVariable Long userId, HttpServletRequest httpRequest){
        UserResponse user = userService.getUser(userId);
        return ApiResponse.success(user, "User retrieved successfully", httpRequest.getRequestURI());
    }
    @PutMapping("/{userId}")
    public ApiResponse<UserResponse> updateUser(@RequestBody UpdateUserRequest request, @PathVariable Long userId, HttpServletRequest httpRequest){
        UserResponse updatedUser = userService.updateUser(request, userId);
        return ApiResponse.success(updatedUser, "User deleted successfully", httpRequest.getRequestURI());
    }
    @DeleteMapping("/{userId}")
    public ApiResponse<Void> deleteUser(@PathVariable Long userId, HttpServletRequest httpRequest){
        userService.deleteUserById(userId);
        return ApiResponse.success(null, "User deleted successfully", httpRequest.getRequestURI());
    }




}
