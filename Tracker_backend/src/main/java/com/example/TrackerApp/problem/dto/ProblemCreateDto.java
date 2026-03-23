package com.example.TrackerApp.problem.dto;

import lombok.Data;

@Data
public class ProblemCreateDto {
    private String title;
    private String link;
    private String solutionCode;
}
