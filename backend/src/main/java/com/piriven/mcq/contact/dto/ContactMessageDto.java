package com.piriven.mcq.contact.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ContactMessageDto(
        UUID id,
        String name,
        String email,
        String subject,
        String message,
        boolean isRead,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
