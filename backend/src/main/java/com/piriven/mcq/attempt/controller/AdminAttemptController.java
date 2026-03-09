package com.piriven.mcq.attempt.controller;

import com.piriven.mcq.attempt.dto.AttemptDetailDto;
import com.piriven.mcq.attempt.dto.StudentAttemptSummaryDto;
import com.piriven.mcq.attempt.service.AttemptService;
import com.piriven.mcq.common.dto.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/student-attempts")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'TEACHER')")
@RequiredArgsConstructor
public class AdminAttemptController {

    private final AttemptService attemptService;

    @GetMapping
    public ResponseEntity<PagedResponse<StudentAttemptSummaryDto>> getAllAttempts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(attemptService.getAllStudentAttempts(page, size));
    }

    @GetMapping("/by-paper/{paperId}")
    public ResponseEntity<PagedResponse<StudentAttemptSummaryDto>> getAttemptsByPaper(
            @PathVariable UUID paperId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(attemptService.getStudentAttemptsByPaper(paperId, page, size));
    }

    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<PagedResponse<StudentAttemptSummaryDto>> getAttemptsByStudent(
            @PathVariable UUID studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(attemptService.getStudentAttemptsByStudent(studentId, page, size));
    }

    @GetMapping("/{attemptId}/detail")
    public ResponseEntity<AttemptDetailDto> getAttemptDetail(@PathVariable UUID attemptId) {
        return ResponseEntity.ok(attemptService.getAttemptDetail(attemptId));
    }
}
