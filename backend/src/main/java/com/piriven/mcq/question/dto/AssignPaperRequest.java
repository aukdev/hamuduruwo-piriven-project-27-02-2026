package com.piriven.mcq.question.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignPaperRequest(@NotNull UUID paperId) {
}
