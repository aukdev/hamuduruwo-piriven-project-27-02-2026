package com.piriven.mcq.paper.dto;

import java.util.List;
import java.util.UUID;

public record PaperDetailDto(
        UUID id,
        int year,
        int paperNo,
        int durationSeconds,
        int questionCount,
        List<PaperQuestionInfo> questions) {
    public record PaperQuestionInfo(
            int position,
            UUID questionId,
            String questionText,
            String subjectName) {
    }
}
