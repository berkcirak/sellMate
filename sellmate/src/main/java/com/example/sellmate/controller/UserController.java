package com.example.sellmate;

import com.example.sellmate.dto.request.CreateUserRequest;
import com.example.sellmate.dto.response.UserResponse;
import com.example.sellmate.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;


    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse saveUser(@RequestBody CreateUserRequest request){
        return userService.saveUser(request);
    }





}
