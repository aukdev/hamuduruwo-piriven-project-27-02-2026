package com.piriven.mcq.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(

        @NotBlank(message = "New password is required") @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters") String newPassword) {
}
