package com.example.TrackerApp.review;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Transient;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Embeddable
@Data
public class ReviewStatus {
    private LocalDate nextReviewDate;
    private LocalDate lastReviewDate;
    private int intervalIndex;
    private int reviewLeft;
    private List<LocalDate> reviewHistory = new ArrayList<>();

    @Transient //prevent field to be saved in DB(like INTERVALS)
    private static final int[] INTERVALS = {3,7,14,28};

    public void startReview(){
        this.intervalIndex = 0;
        this.nextReviewDate = LocalDate.now().plusDays(INTERVALS[intervalIndex]);
        this.reviewLeft = INTERVALS.length;
    }
    public void markReview(){
        LocalDate today = LocalDate.now();
        this.reviewHistory.add(today);
        this.lastReviewDate = today;
        this.intervalIndex++;
        this.reviewLeft = Math.max(INTERVALS.length - intervalIndex, 0);
        if(intervalIndex < INTERVALS.length){
            this.nextReviewDate = today.plusDays(INTERVALS[intervalIndex]);
        }else{
            this.nextReviewDate = null;
        }
    }
    public boolean isReadyToReview(){
        return nextReviewDate != null && nextReviewDate.isBefore(LocalDate.now());
    }
    public boolean isFullyReview(){
        return nextReviewDate == null;
    }
}
