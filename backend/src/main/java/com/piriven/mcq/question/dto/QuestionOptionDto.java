package com.piriven.mcq.question.dto;

import java.util.UUID;

public record QuestionOptionDto(
        UUID id,
        String optionText,
        int optionOrder,
        Boolean isCorrect // null when hidden from students
) {
}
