package com.piriven.mcq.question.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuestionOptionRequest(

        @NotBlank(message = "Option text is required") String optionText,

        @NotNull(message = "isCorrect is required") Boolean isCorrect,

        @Min(value = 1, message = "Option order must be between 1 and 4") @Max(value = 4, message = "Option order must be between 1 and 4") int optionOrder) {
}
