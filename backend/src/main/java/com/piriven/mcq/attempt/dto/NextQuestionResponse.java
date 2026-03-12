package com.piriven.mcq.attempt.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.piriven.mcq.question.dto.QuestionOptionDto;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record NextQuestionResponse(
        boolean attemptExpired,
        boolean allQuestionsAnswered,
        Integer questionNumber, // position in paper
        Integer totalQuestions, // total questions in paper
        UUID questionId,
        String questionText,
        List<QuestionOptionDto> options, // WITHOUT isCorrect
        Long remainingSecondsTotal,
        Long remainingSecondsForQuestion,
        String message) {

    public static NextQuestionResponse expired(UUID attemptId) {
        return new NextQuestionResponse(
                true, false, null, null, null, null, null, 0L, 0L,
                "Attempt time has expired. Your attempt has been marked as EXPIRED.");
    }

    public static NextQuestionResponse allAnswered() {
        return new NextQuestionResponse(
                false, true, null, null, null, null, null, null, null,
                "All questions have been answered. Please submit your attempt.");
    }
}
