package com.piriven.mcq.paper.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PaperQuestionAssignRequest(

        @NotNull(message = "Question ID is required") UUID questionId,

        @Min(value = 1, message = "Position must be between 1 and 40") @Max(value = 40, message = "Position must be between 1 and 40") int position) {
}
