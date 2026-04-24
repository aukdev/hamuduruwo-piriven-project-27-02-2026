package com.piriven.mcq.vichara.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateVcharaRequest(

        @NotNull(message = "Vichara subject ID is required") UUID vcharaSubjectId,

        @NotBlank(message = "Title is required") @Size(min = 1, max = 500, message = "Title must be between 1 and 500 characters") String title,

        @NotBlank(message = "Content is required") String content) {
}
