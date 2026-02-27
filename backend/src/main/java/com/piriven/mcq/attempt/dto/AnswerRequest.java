package com.piriven.mcq.attempt.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AnswerRequest(

        @NotNull(message = "Question ID is required") UUID questionId,

        @NotNull(message = "Selected option ID is required") UUID selectedOptionId) {
}
