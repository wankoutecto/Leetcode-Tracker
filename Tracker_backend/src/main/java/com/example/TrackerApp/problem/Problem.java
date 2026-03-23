package com.example.TrackerApp.problem;

import com.example.TrackerApp.review.ReviewStatus;
import com.example.TrackerApp.user.UserAccount;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Problem {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String link;
    @Column(columnDefinition = "TEXT")
    private String solutionCode;
    @Embedded
    private ReviewStatus reviewStatus;
    @ManyToOne
    private UserAccount userAccount;
}
