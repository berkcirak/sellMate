package com.example.sellmate.controller;

import com.example.sellmate.entity.User;
import com.example.sellmate.service.JWTService;
import com.example.sellmate.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private UserService userService;
    private JWTService jwtService;
    public UserController(UserService userService, JWTService jwtService){
        this.userService=userService;
        this.jwtService=jwtService;
    }
    @PostMapping("/register")
    public String createUser(@RequestBody User user){
        User createdUser = userService.createUser(user);
        return jwtService.generateToken(createdUser.getUsername());
    }


}
