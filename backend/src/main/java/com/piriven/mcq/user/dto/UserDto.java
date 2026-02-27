package com.piriven.mcq.user.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String fullName,
        String role,
        String status,
        boolean teacherVerified,
        LocalDateTime createdAt) {
}
