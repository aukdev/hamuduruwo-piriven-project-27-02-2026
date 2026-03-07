package com.piriven.mcq.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(

        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,

        @NotBlank(message = "Password is required") @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters") String password,

        @NotBlank(message = "Full name is required") @Size(min = 2, max = 255) String fullName,

        @NotBlank(message = "Role is required") String role) {
}
