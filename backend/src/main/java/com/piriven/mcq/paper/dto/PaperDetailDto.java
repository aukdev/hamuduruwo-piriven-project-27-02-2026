package com.piriven.mcq.paper.dto;

import java.util.List;
import java.util.UUID;

public record PaperDetailDto(
                UUID id,
                int year,
                UUID subjectId,
                String subjectName,
                int durationSeconds,
                int questionCount,
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
