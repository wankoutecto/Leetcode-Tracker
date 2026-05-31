package com.example.TrackerApp.problem;

import com.example.TrackerApp.common.exception.DuplicateResourceException;
import com.example.TrackerApp.common.ApiResponse;
import com.example.TrackerApp.problem.dto.ProblemCreateDto;
import com.example.TrackerApp.problem.dto.ProblemResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("api/problems")
public class ProblemController {
    @Autowired
    ProblemService pbService;
    @Autowired
    ProblemMapper problemMapper;
    @PostMapping("add")
    public ResponseEntity<ApiResponse> addProblem(@RequestBody ProblemCreateDto pbRequest){
        try {
            pbService.addUserProblem(pbRequest);
            return ResponseEntity.ok(new ApiResponse(null,pbRequest.getTitle()+ " is successfully added"));
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @PostMapping("/{problemId}/reviewed")
    public ResponseEntity<ApiResponse> reviewProblem(@PathVariable Integer problemId){
        try {
            pbService.markUserProblemReview(problemId);
            return ResponseEntity.ok(new ApiResponse(null, "Problem reviewed"));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(null, "Problem already reviewed"));
        }
    }

    @GetMapping("/due-today")
    public ResponseEntity<ApiResponse> getUserProblemDueToday(){
        try {
            return ResponseEntity.ok(new ApiResponse(pbService.getUserProblemDueToday()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/fully-reviewed")
    public ResponseEntity<ApiResponse> getUserProblemFullyReviewed(){
        try {
            return ResponseEntity.ok(new ApiResponse(pbService.getUserProblemFullyReviewed()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/future-review")
    public ResponseEntity<?> getUserProblemFutureReview(){
        try {
            return ResponseEntity.ok(new ApiResponse(pbService.getUserProblemFutureReview()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/all-problems")
    public ResponseEntity<?> getAllUserProblems(){
        try {
            return ResponseEntity.ok(new ApiResponse(pbService.getAllUserProblems()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/overdue")
    public ResponseEntity<?> getUserProblemOverdue(){
        try {
            return ResponseEntity.ok(new ApiResponse(pbService.getUserProblemOverdue()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/home")
    public ResponseEntity<?> getFiveRandomProblem(){
        try {
            return ResponseEntity.ok(new ApiResponse(pbService.getFiveRandomProblem()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @PutMapping("/{pbId}/update")
    public  ResponseEntity<?> updateProblem(@RequestBody ProblemResponseDto problemResponseDto, @PathVariable Integer pbId){
        try {
            ProblemResponseDto pbResponse = pbService.updateUserProblem(problemResponseDto, pbId);
            System.out.println(pbResponse);
            return ResponseEntity.ok(new ApiResponse(pbResponse, "Successful update"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/delete")
    public  ResponseEntity<?> deleteProblem(@PathVariable Integer id){
        try {
            System.out.println(id);
            pbService.deleteUserProblem(id);
            return ResponseEntity.ok(new ApiResponse(null, "Successful deletion"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(null, e.getMessage()));
        }
    }

    @PostMapping("/{id}/reset")
    public ResponseEntity<?> resetProblemReview(@PathVariable Integer id){
        try {
            pbService.resetUserProblemReview(id);
            return ResponseEntity.ok(new ApiResponse(null, "Problem review reset"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(null, e.getMessage()));
        }
    }
}
