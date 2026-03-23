package com.example.TrackerApp.user;

import com.example.TrackerApp.auth.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    private final PasswordEncoder passwordEncoder;

    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public UserAccount toUser(RegisterRequest request){
        UserAccount userAccount = new UserAccount();
        userAccount.setUsername(request.getUsername());
        String hashPassword  = passwordEncoder.encode(request.getPassword());
        userAccount.setPassword(hashPassword);
        userAccount.getRoles().add("USER");
        return userAccount;
    }
}
