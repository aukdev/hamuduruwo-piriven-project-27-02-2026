package com.piriven.mcq.paper.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record PaperCreateRequest(

                @Min(value = 2000, message = "Year must be at least 2000") @Max(value = 2100, message = "Year must be at most 2100") Integer year,

                @NotNull(message = "Subject ID is required") UUID subjectId,

                @Size(max = 500, message = "Title must be at most 500 characters") String title,

                @Min(value = 1, message = "Question count must be at least 1") @Max(value = 200, message = "Question count must be at most 200") int questionCount,

                @Min(value = 60, message = "Duration must be at least 60 seconds") int durationSeconds) {
}
