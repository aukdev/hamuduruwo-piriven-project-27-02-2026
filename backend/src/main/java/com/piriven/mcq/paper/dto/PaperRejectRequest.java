package com.piriven.mcq.paper.dto;

import jakarta.validation.constraints.NotBlank;

public record PaperRejectRequest(
        @NotBlank(message = "Rejection reason is required") String reason) {
}
