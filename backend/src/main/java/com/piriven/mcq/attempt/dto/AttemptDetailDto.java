package com.piriven.mcq.attempt.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AttemptDetailDto(
                UUID attemptId,
                UUID studentId,
                String studentName,
                String studentEmail,
                Integer year,
                String subjectName,
                int attemptNo,
                String status,
                int correctCount,
                int wrongCount,
                int unansweredCount,
                int score,
                int totalQuestions,
                LocalDateTime startedAt,
                LocalDateTime submittedAt,
                List<AttemptAnswerDetailDto> answers) {

        public record AttemptAnswerDetailDto(
                        int questionNumber,
                        UUID questionId,
                        String questionText,
                        List<OptionDetail> options,
                        UUID selectedOptionId,
                        String selectedOptionText,
                        Integer selectedOptionOrder,
                        boolean isCorrect,
                        boolean isTimeout,
                        boolean isUnanswered,
                        Integer timeTakenSeconds,
                        LocalDateTime answeredAt) {
        }

        public record OptionDetail(
                        UUID id,
                        String optionText,
                        int optionOrder,
                        boolean isCorrect,
                        boolean isSelected) {
        }
}
