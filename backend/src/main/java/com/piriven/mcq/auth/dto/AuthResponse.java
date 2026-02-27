package com.piriven.mcq.auth.dto;

import java.util.UUID;

public record AuthResponse(
        String token,
        String tokenType,
        UUID userId,
        String email,
        String fullName,
        String role) {
    public AuthResponse(String token, UUID userId, String email, String fullName, String role) {
        this(token, "Bearer", userId, email, fullName, role);
    }
}
