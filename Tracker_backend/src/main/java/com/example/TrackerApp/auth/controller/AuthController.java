package com.example.TrackerApp.auth.controller;

import com.example.TrackerApp.auth.dto.LoginRequest;
import com.example.TrackerApp.auth.dto.RegisterRequest;
import com.example.TrackerApp.auth.service.AuthService;
import com.example.TrackerApp.common.exception.DuplicateResourceException;
import com.example.TrackerApp.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> registration(@Valid @RequestBody RegisterRequest request,
                                                   BindingResult result){
        try {
            if (result.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                result.getFieldErrors().forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage())
                );
                return ResponseEntity.badRequest().body(new ApiResponse(errors, "Validation failed"));
            }
            authService.registration(request);
            return ResponseEntity.ok(new ApiResponse(null, "User registered successfully"));
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(null, "Something went wrong: "));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> logUser(@Valid @RequestBody LoginRequest loginRequest,
                                     BindingResult result){
        try {
            if(result.hasErrors()){
                Map<String, String> errors = new HashMap<>();
                result.getFieldErrors().forEach(error ->
                        errors.put(error.getField(), error.getDefaultMessage()));
                return ResponseEntity.badRequest().body(new ApiResponse(errors, "Validation failed"));
            }
            String token = authService.logUser(loginRequest);
            HashMap<String, String> tokenMap = new HashMap<>();
            tokenMap.put("token", token);
            return ResponseEntity.ok(new ApiResponse(tokenMap));
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }
}
