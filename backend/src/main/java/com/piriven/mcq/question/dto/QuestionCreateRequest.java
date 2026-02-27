package com.piriven.mcq.question.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record QuestionCreateRequest(

        @NotNull(message = "Subject ID is required")
        UUID subjectId,

        @NotBlank(message = "Question text is required")
        String questionText,

        @NotNull(message = "Options are required")
        @Size(min = 4, max = 4, message = "Exactly 4 options are required")
        @Valid
        List<QuestionOptionRequest> options
) {
}
