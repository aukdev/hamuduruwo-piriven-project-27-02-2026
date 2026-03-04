package com.piriven.mcq.paper.dto;

import java.util.UUID;

public record PaperDto(
                UUID id,
                int year,
                UUID subjectId,
                String subjectName,
                int durationSeconds,
                int questionCount,
                long assignedQuestions) {
}
