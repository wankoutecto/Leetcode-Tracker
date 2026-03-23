package com.example.TrackerApp.problem;

import com.example.TrackerApp.problem.dto.ProblemCreateDto;
import com.example.TrackerApp.problem.dto.ProblemResponseDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProblemMapper {
    public ProblemResponseDto toProblemDto(Problem problem) {
        ProblemResponseDto dto = new ProblemResponseDto();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setLink(problem.getLink());
        dto.setSolutionCode(problem.getSolutionCode());
        dto.setLastReviewDate(problem.getReviewStatus().getLastReviewDate());
        dto.setNextReviewDate(problem.getReviewStatus().getNextReviewDate());
        dto.setReviewLeft(problem.getReviewStatus().getReviewLeft());
        return dto;
    }
    public List<ProblemResponseDto> toProblemDtoList(List<Problem> problems){
        return problems.stream()
                .map(this::toProblemDto)
                .collect(Collectors.toList());
    }
}
