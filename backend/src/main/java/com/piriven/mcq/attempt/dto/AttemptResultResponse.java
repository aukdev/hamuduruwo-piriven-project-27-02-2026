package com.piriven.mcq.attempt.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AttemptResultResponse(
        UUID attemptId,
        int attemptNo,
        String status,
        Integer year,
        String subjectName,
        int correctCount,
        int wrongCount,
        int unansweredCount,
        int score,
        int totalQuestions,
        LocalDateTime startedAt,
        LocalDateTime submittedAt,

        // Sinhala encouragement message based on score
        String scoreMessage,

        // Comparison with previous best
        Integer previousBestScore,
        boolean isNewBest,
        String comparisonMessage) {
}
