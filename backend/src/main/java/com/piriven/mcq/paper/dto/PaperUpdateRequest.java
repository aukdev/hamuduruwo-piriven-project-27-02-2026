package com.piriven.mcq.paper.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record PaperUpdateRequest(

        @Min(value = 1, message = "Question count must be at least 1") @Max(value = 200, message = "Question count must be at most 200") int questionCount,

        @Min(value = 60, message = "Duration must be at least 60 seconds") int durationSeconds) {
}
