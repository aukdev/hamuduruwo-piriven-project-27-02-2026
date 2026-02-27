package com.piriven.mcq.subject.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSubjectRequest(

        @NotBlank(message = "Subject name is required") @Size(min = 1, max = 255, message = "Subject name must be between 1 and 255 characters") String name,

        String description) {
}
