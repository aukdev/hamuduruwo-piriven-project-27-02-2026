package com.piriven.mcq.attempt.dto;

public record AnswerResponse(
        boolean acknowledged,
        boolean wasTimeout,
        boolean attemptExpired,
        String message) {
}
