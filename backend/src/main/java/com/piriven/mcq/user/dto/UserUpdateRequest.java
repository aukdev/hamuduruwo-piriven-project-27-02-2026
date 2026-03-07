package com.piriven.mcq.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(

        @NotBlank(message = "Full name is required") @Size(max = 255) String fullName,

        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,

        @NotBlank(message = "Role is required") String role,

        @NotBlank(message = "Status is required") String status,

        Boolean teacherVerified) {
}
