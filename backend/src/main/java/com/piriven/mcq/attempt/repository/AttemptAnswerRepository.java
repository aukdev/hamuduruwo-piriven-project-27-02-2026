package com.piriven.mcq.attempt.repository;

import com.piriven.mcq.attempt.entity.AttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, UUID> {

    List<AttemptAnswer> findByAttemptIdOrderByPaperQuestionPositionAsc(UUID attemptId);

    List<AttemptAnswer> findByAttemptId(UUID attemptId);

    Optional<AttemptAnswer> findByAttemptIdAndAnsweredAtIsNullAndIsTimeoutFalse(UUID attemptId);

    long countByAttemptIdAndIsCorrectTrue(UUID attemptId);

    long countByAttemptIdAndAnsweredAtIsNotNull(UUID attemptId);

    long countByAttemptId(UUID attemptId);

    boolean existsByAttemptIdAndPaperQuestionId(UUID attemptId, UUID paperQuestionId);
}
