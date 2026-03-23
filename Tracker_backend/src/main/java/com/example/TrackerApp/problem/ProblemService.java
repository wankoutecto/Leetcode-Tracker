package com.example.TrackerApp.problem;

import com.example.TrackerApp.common.exception.DuplicateResourceException;
import com.example.TrackerApp.common.exception.ResourceNotFoundException;
import com.example.TrackerApp.problem.dto.ProblemCreateDto;
import com.example.TrackerApp.problem.dto.ProblemResponseDto;
import com.example.TrackerApp.user.UserAccount;
import com.example.TrackerApp.user.UserRepository;
import com.example.TrackerApp.review.ReviewStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
public class ProblemService {
    @Autowired
    ProblemRepository problemRepository;
    @Autowired
    ProblemMapper problemMapper;
    @Autowired
    UserRepository userRepository;

    public Problem getUserProblemById(Integer pbId) {
        Integer userId = getUserAccount().getUserId();
        return problemRepository.findByUserAccount_UserIdAndId(userId, pbId)
                .orElseThrow(()->new ResourceNotFoundException("Problem not found"));
    }

    public UserAccount getUserAccount(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()-> new ResourceNotFoundException("User is not logged in"));
    }


    public void addUserProblem(ProblemCreateDto pbRequest) {
        UserAccount userAccount = getUserAccount();
        if(problemRepository.findByUserAccount_UserIdAndTitle(userAccount.getUserId(),pbRequest.getTitle()).isPresent()){
            throw new DuplicateResourceException("You already added this problem: " + pbRequest.getTitle());
        }
        Problem pb = new Problem();
        String title = pbRequest.getTitle();
        if(title == null || title.isBlank()) throw new IllegalArgumentException("Title is required");
        pb.setTitle(pbRequest.getTitle().strip().toLowerCase());
        pb.setLink(pbRequest.getLink());
        pb.setSolutionCode(pbRequest.getSolutionCode());
        ReviewStatus reviewStatus = new ReviewStatus();
        reviewStatus.startReview();
        pb.setReviewStatus(reviewStatus);
        pb.setUserAccount(userAccount);
        problemRepository.save(pb);
    }

    public List<ProblemResponseDto> getUserProblemDueToday() {
        Integer userId = getUserAccount().getUserId();
        LocalDate today = LocalDate.now();
        List<Problem> problemList = problemRepository.findAllByUserAccountAndDueToday(userId, today);
        return problemMapper.toProblemDtoList(problemList);
    }
    public List<ProblemResponseDto> getUserProblemFutureReview() {
        Integer userId = getUserAccount().getUserId();
        LocalDate today = LocalDate.now();
        List<Problem> problemList = problemRepository.findAllByUserAccountAndFutureReview(userId, today);
        return problemMapper.toProblemDtoList(problemList);
    }
    public List<ProblemResponseDto>getUserProblemOverdue() {
        Integer userId = getUserAccount().getUserId();
        LocalDate today = LocalDate.now();
        List<Problem> problemList = problemRepository.findAllByUserAccountAndOverdue(userId, today);
        return problemMapper.toProblemDtoList(problemList);
    }

    public List<ProblemResponseDto> getUserProblemFullyReviewed(){
        Integer userId = getUserAccount().getUserId();
        LocalDate today = LocalDate.now();
        List<Problem> problemList = problemRepository.findAllByUserAccountAndFullyReviewed(userId);
        return problemMapper.toProblemDtoList(problemList);
    }

    public List<ProblemResponseDto> getAllUserProblems(){
        Integer userId = getUserAccount().getUserId();
        List<Problem> problemList = problemRepository.findAllByUserAccount_UserId(userId);
        return problemMapper.toProblemDtoList(problemList);
    }

    public void markUserProblemReview(Integer problemId) {
        Problem problem = getUserProblemById(problemId);
        problem.getReviewStatus().markReview();
        problemRepository.save(problem);
    }

    public List<ProblemResponseDto> getFiveRandomProblem() {
        List<Problem> problemList = problemRepository.findFiveRandomProblem();
        return problemMapper.toProblemDtoList(problemList);
    }

    public void updateUserProblem(ProblemResponseDto problemResponseDto, Integer pbId) {
        Problem problem = getUserProblemById(pbId);
        problem.setSolutionCode(problemResponseDto.getSolutionCode());
        problemRepository.save(problem);
    }

    public void deleteUserProblem(Integer pbId) {
        Problem problem = getUserProblemById(pbId);
        problemRepository.delete(problem);
    }

    public void resetUserProblemReview(Integer pbId) {
        Problem problem = getUserProblemById(pbId);
        if(!problem.getReviewStatus().isFullyReview()){
            throw new RuntimeException("Sorry you can't reset this problem. "
                    + problem.getTitle() + " is not fully reviewed");
        }
        problem.getReviewStatus().startReview();
        problemRepository.save(problem);
    }

}
