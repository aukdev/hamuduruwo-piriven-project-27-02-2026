package com.piriven.mcq.question.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestionDto(
                UUID id,
                UUID subjectId,
                String subjectName,
                Integer year,
                UUID paperId,
                String questionText,
                String status,
                String rejectionReason,
                String approvedByEmail,
                LocalDateTime approvedAt,
                Integer version,
                List<QuestionOptionDto> options,
                String createdByEmail,
                LocalDateTime createdAt,
                LocalDateTime updatedAt) {
}
