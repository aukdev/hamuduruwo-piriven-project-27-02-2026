package com.piriven.mcq.paper.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PaperDetailDto(
                UUID id,
                Integer year,
                UUID subjectId,
                String subjectName,
                int durationSeconds,
                int questionCount,
                String paperType,
                String title,
                String status,
                List<PaperQuestionInfo> questions) {

        public record PaperQuestionInfo(
                        int position,
                        UUID questionId,
                        String questionText,
                        List<OptionInfo> options) {
        }

        public record OptionInfo(
                        UUID id,
                        String optionText,
                        int optionOrder,
                        boolean isCorrect) {
        }
}
