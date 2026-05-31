package com.example.TrackerApp.problem.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProblemResponseDto {
    private Integer id;
    private String title;
    private String slug;
    private String solution;
    private String url;
    private String difficulty;
    private List<String> topics;
    private String description;
    private LocalDate createdAt;
    private LocalDate nextReviewDate;
    private LocalDate lastReviewDate;
    private Integer reviewLeft;
}
