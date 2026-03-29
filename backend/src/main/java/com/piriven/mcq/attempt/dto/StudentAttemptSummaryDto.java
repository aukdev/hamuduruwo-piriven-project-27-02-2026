package com.piriven.mcq.attempt.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record StudentAttemptSummaryDto(
                UUID attemptId,
                UUID studentId,
                String studentName,
                String studentEmail,
                UUID paperId,
                int year,
                String subjectName,
                int attemptNo,
                String status,
                int correctCount,
                int wrongCount,
                int score,
                int totalQuestions,
                String paperType,
                String paperTitle,
                LocalDateTime startedAt,
                LocalDateTime submittedAt) {
}
