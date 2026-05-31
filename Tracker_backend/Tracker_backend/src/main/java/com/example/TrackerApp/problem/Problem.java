package com.example.TrackerApp.problem;

import com.example.TrackerApp.review.ReviewStatus;
import com.example.TrackerApp.user.UserAccount;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
public class Problem {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String slug;
    private String url;
    private String difficulty;
    private List<String> topics;
    @Column(columnDefinition = "TEXT")
    private String description;
    private LocalDate createdAt;
    @Column(columnDefinition = "TEXT")
    private String solution;
    @Embedded
    private ReviewStatus reviewStatus;
    @ManyToOne
    private UserAccount userAccount;
}
