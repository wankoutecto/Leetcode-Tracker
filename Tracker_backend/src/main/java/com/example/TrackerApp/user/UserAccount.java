package com.example.TrackerApp.user;

import com.example.TrackerApp.problem.Problem;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class UserAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
    private String username;
    private String password;

    // Initialized to avoid null checks when assigning roles
    private List<String> roles = new ArrayList<>();

    //Manages by JPA, represents all problems associated with this user
    @OneToMany(mappedBy = "userAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Problem> problem;
}
