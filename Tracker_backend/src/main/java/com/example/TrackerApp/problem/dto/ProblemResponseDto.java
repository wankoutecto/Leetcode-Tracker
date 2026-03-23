package com.example.TrackerApp.problem.dto;

import lombok.Data;

import java.time.LocalDate;
@Data
public class ProblemResponseDto {
    private Integer id;
    private String title;
    private String link;
    private String solutionCode;
    private LocalDate nextReviewDate;
    private LocalDate lastReviewDate;
    private Integer reviewLeft;
}
