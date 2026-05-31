package com.example.TrackerApp.problem;

import com.example.TrackerApp.problem.dto.ProblemCreateDto;
import com.example.TrackerApp.problem.dto.ProblemResponseDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProblemMapper {
    @Autowired
    ModelMapper modelMapper;
    public ProblemResponseDto toProblemDto(Problem problem) {
        ProblemResponseDto dto = modelMapper.map(problem, ProblemResponseDto.class);
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
