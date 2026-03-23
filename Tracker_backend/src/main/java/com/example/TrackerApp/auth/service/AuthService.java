package com.example.TrackerApp.auth.service;

import com.example.TrackerApp.user.UserRepository;
import com.example.TrackerApp.user.UserAccount;
import com.example.TrackerApp.auth.dto.LoginRequest;
import com.example.TrackerApp.auth.dto.RegisterRequest;
import com.example.TrackerApp.common.exception.DuplicateResourceException;
import com.example.TrackerApp.user.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    UserMapper userMapper;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AuthenticationManager authManager;
    @Autowired
    JwtService jwtService;

    public void registration(RegisterRequest request) {
        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw  new DuplicateResourceException("username already exists. please enter another one");
        }
        UserAccount userAccount = userMapper.toUser(request);
        userRepository.save(userAccount);
    }

    public String logUser(LoginRequest loginRequest) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken
                        (loginRequest.getUsername(), loginRequest.getPassword()));
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return jwtService.generateToken(userDetails.getUsername());
    }

}
