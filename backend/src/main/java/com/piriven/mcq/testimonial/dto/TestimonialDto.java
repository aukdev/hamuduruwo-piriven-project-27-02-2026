package com.piriven.mcq.testimonial.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record TestimonialDto(
        UUID id,
        UUID userId,
        String userName,
        String userRole,
        String quote,
        String positionTitle,
        Integer rating,
        boolean hasPhoto,
        boolean isPublished,
        boolean isFormEnabled,
        boolean isSubmitted,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
