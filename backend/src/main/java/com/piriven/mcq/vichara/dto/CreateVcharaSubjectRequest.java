package com.piriven.mcq.vichara.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateVcharaSubjectRequest(

        @NotBlank(message = "Vichara subject name is required") @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters") String name,

        String description,

        int displayOrder) {
}
