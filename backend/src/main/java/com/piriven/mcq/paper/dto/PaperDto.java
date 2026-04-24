package com.piriven.mcq.paper.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PaperDto(
        UUID id,
        Integer year,
        UUID subjectId,
        String subjectName,
        int durationSeconds,
        int questionCount,
        long assignedQuestions,
        String paperType,
        String title,
        String status,
        String createdByEmail,
        String createdByName) {
}
