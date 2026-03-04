package com.piriven.mcq.paper.dto;

import com.piriven.mcq.question.dto.QuestionOptionRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PaperQuestionCreateRequest(

        @NotBlank(message = "Question text is required") String questionText,

        @Valid @Size(min = 4, max = 4, message = "Exactly 4 options are required") List<QuestionOptionRequest> options) {
}
