package com.piriven.mcq.attempt.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AttemptStartResponse(
        UUID attemptId,
        int attemptNo,
        Integer year,
        String subjectName,
        int totalQuestions,
        int durationSeconds,
        LocalDateTime startedAt,
        LocalDateTime expiresAt) {
}
