package com.piriven.mcq.common.dto;

public record PublicStatsResponse(
        long studentCount,
        long teacherCount,
        long paperCount,
        long subjectCount) {
}
