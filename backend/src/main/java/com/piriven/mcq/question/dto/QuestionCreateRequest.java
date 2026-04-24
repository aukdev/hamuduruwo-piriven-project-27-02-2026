package com.piriven.mcq.question.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;
import java.util.UUID;

public record QuestionCreateRequest(

                UUID subjectId,

                Integer year,

                UUID paperId,

                @NotBlank(message = "Question text is required") String questionText,

                @NotNull(message = "Options are required") @Size(min = 4, max = 4, message = "Exactly 4 options are required") @Valid List<QuestionOptionRequest> options) {
}
