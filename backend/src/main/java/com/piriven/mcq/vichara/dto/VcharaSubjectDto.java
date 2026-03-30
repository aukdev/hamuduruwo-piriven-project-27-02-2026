package com.piriven.mcq.vichara.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record VcharaSubjectDto(
        UUID id,
        String name,
        String description,
        int displayOrder,
        LocalDateTime createdAt) {
}
