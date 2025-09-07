package com.example.sellmate.controller;

import com.example.sellmate.common.ApiResponse;
import com.example.sellmate.dto.request.AuthLoginRequest;
import com.example.sellmate.dto.request.CreateUserRequest;
import com.example.sellmate.dto.response.AuthResponse;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.security.JwtService;
import com.example.sellmate.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService){
        this.userService=userService;
        this.authenticationManager=authenticationManager;
        this.jwtService=jwtService;
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@ModelAttribute CreateUserRequest request){
        return ApiResponse.success(userService.saveUser(request), "User created successfully", "/auth/register");
    }
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody AuthLoginRequest request){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        String token = jwtService.generateToken(request.email());
        return ApiResponse.success(new AuthResponse(token), "Login successful", "/auth/login");
    }


}
