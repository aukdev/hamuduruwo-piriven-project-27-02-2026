package com.piriven.mcq.paper.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PaperQuestionAssignRequest(

                @NotNull(message = "Question ID is required") UUID questionId,

                @Min(value = 1, message = "Position must be at least 1") @Max(value = 200, message = "Position too large") int position) {
}
