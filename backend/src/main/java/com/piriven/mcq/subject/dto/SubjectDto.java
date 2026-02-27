package com.piriven.mcq.subject.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubjectDto(
        UUID id,
        String name,
        String description,
        LocalDateTime createdAt) {
}
