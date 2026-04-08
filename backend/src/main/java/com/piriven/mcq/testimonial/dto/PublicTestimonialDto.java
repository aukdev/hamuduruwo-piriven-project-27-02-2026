package com.piriven.mcq.testimonial.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PublicTestimonialDto(
        UUID id,
        String userName,
        String userRole,
        String quote,
        String positionTitle,
        Integer rating,
        boolean hasPhoto,
        LocalDateTime createdAt) {
}
