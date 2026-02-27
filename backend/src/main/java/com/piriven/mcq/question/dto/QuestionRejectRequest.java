package com.piriven.mcq.question.dto;

import jakarta.validation.constraints.NotBlank;

public record QuestionRejectRequest(

        @NotBlank(message = "Rejection reason is required") String reason) {
}
