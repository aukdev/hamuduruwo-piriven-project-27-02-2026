package com.piriven.mcq.paper.dto;

import java.util.UUID;

public record PaperDto(
        UUID id,
        int year,
        int paperNo,
        int durationSeconds,
        int questionCount,
        long assignedQuestions // how many questions are actually assigned
) {
}
