package com.piriven.mcq.attempt.controller;

import com.piriven.mcq.attempt.dto.AttemptDetailDto;
import com.piriven.mcq.attempt.dto.StudentAttemptSummaryDto;
import com.piriven.mcq.attempt.service.AttemptService;
import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.security.CurrentUser;
import com.piriven.mcq.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/teacher/student-attempts")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherAttemptController {

    private final AttemptService attemptService;

    @GetMapping
    public ResponseEntity<PagedResponse<StudentAttemptSummaryDto>> getMyStudentAttempts(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(attemptService.getTeacherStudentAttempts(currentUser.getId(), page, size));
    }

    @GetMapping("/by-paper/{paperId}")
    public ResponseEntity<PagedResponse<StudentAttemptSummaryDto>> getAttemptsByPaper(
            @PathVariable UUID paperId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(attemptService.getStudentAttemptsByPaper(paperId, page, size));
    }

    @GetMapping("/{attemptId}/detail")
    public ResponseEntity<AttemptDetailDto> getAttemptDetail(@PathVariable UUID attemptId) {
        return ResponseEntity.ok(attemptService.getAttemptDetail(attemptId));
    }
}
