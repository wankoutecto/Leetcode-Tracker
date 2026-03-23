package com.example.TrackerApp.problem;


import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Integer> {

    Optional<Problem> findByUserAccount_UserIdAndTitle(Integer userId, String title);
    Optional<Problem> findByUserAccount_UserIdAndId(Integer userId, Integer id);

    @Query("select p FROM Problem p where " +
            "p.userAccount.userId = :userId AND " +
            "p.reviewStatus.nextReviewDate = :today")
    List<Problem> findAllByUserAccountAndDueToday(@Param("userId")Integer userId,
                                                  @Param("today")LocalDate today);
    @Query("select p FROM Problem p where " +
            "p.userAccount.userId = :userId AND " +
            "p.reviewStatus.nextReviewDate < :today")
    List<Problem> findAllByUserAccountAndOverdue(@Param("userId")Integer userId,
                                                 @Param("today")LocalDate today);
    @Query("select p FROM Problem p where " +
            "p.userAccount.userId = :userId AND " +
            "p.reviewStatus.nextReviewDate IS NULL")
    List<Problem> findAllByUserAccountAndFullyReviewed(@Param("userId") Integer userId);

    @Query("select p FROM Problem p where " +
                  "p.reviewStatus.nextReviewDate IS NULL")
    List<Problem> findAllFullyReviewed();
    @Query("select p FROM Problem p where " +
            "p.userAccount.userId = :userId AND " +
            "p.reviewStatus.nextReviewDate > :today")
    List<Problem> findAllByUserAccountAndFutureReview(@Param("userId")Integer userId,
                                                      @Param("today")LocalDate today);

    List<Problem> findAllByUserAccount_UserId(Integer userId);
    @Query(value = """
            select DISTINCT ON (title) *
            from problem
            ORDER BY title, RANDOM()
            LIMIT 5""", nativeQuery = true)
    List<Problem> findFiveRandomProblem();

    @Modifying
    @Transactional
    @Query(value = """
    UPDATE problem p
    SET next_review_date = CURRENT_DATE
    WHERE p.next_review_date IS NULL
    AND p.last_review_date < :cutoff
    """, nativeQuery = true)
    int resetExpiredProblems(@Param("cutoff") LocalDate cutoff);

    @Query("""
            select p from Problem p
            where p.reviewStatus.nextReviewDate = :today
            """)
    List<Problem> findAllDueToday(LocalDate today);
}
