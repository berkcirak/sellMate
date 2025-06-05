package com.example.sellmate.service;

import com.example.sellmate.entity.User;
import com.example.sellmate.model.UserDTO;
import com.example.sellmate.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private AuthenticationManager authenticationManager;
    private JWTService jwtService;

    public  UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, AuthenticationManager authenticationManager, JWTService jwtService){
        this.userRepository=userRepository;
        this.bCryptPasswordEncoder=bCryptPasswordEncoder;
        this.authenticationManager=authenticationManager;
        this.jwtService=jwtService;
    }
    public User createUser(User user){
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setJoinedDate(LocalDateTime.now());
        return userRepository.save(user);
    }
    public List<User> getUsers(){
        return userRepository.findAll();
    }
    public Optional<User> getUserById(int userId){
        return userRepository.findById(userId);
    }
    public User updateUser(UserDTO theUser, int userId){
        User myUser = getAuthenticatedUser();
        if (myUser.getId() != userId){
            throw new RuntimeException("You are not authorized to update this user");
        }
        User toUpdate = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        if (theUser.getUsername() != null){
            toUpdate.setUsername(theUser.getUsername());
        }
        if (theUser.getName() != null){
            toUpdate.setName(theUser.getName());
        }
        if (theUser.getSurname() != null){
            toUpdate.setSurname(theUser.getSurname());
        }
        if (theUser.getPassword() != null){
            toUpdate.setPassword(bCryptPasswordEncoder.encode(theUser.getPassword()));
        }
        if (theUser.getBio() != null){
            toUpdate.setBio(theUser.getBio());
        }
        if (theUser.getEmail() != null){
            toUpdate.setEmail(theUser.getEmail());
        }
        if (theUser.getProfilePicture() != null){
            toUpdate.setProfilePicture(theUser.getProfilePicture());
        }
        return userRepository.save(toUpdate);
    }
    public void deleteUser(int userId){
        User currentUser = getAuthenticatedUser();
        if (currentUser.getId() != userId){
            throw new RuntimeException("You are not authorized to update this user");
        }
        userRepository.deleteById(userId);
    }
    public User getAuthenticatedUser(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails){
            username=((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username);
    }

    public String verify(User user){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        }
        return "fail";
    }



}
