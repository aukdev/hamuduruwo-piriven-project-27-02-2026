package com.piriven.mcq.vichara.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record VcharaDto(
        UUID id,
        UUID vcharaSubjectId,
        String vcharaSubjectName,
        String title,
        String content,
        String createdByName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
