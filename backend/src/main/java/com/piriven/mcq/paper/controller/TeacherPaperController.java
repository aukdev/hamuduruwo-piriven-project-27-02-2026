package com.piriven.mcq.paper.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.paper.dto.*;
import com.piriven.mcq.paper.service.PaperService;
import com.piriven.mcq.security.CurrentUser;
import com.piriven.mcq.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teacher/papers")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherPaperController {

    private final PaperService paperService;

    // ==================== Past Papers (Read-only, for question assignment)
    // ====================

    @GetMapping
    public ResponseEntity<List<PaperDto>> getMyPapers(@CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(paperService.getTeacherPapers(currentUser.getId()));
    }

    @GetMapping(params = "subjectId")
    public ResponseEntity<List<PaperDto>> getMyPapersBySubject(
            @RequestParam UUID subjectId,
            @CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(paperService.getTeacherPapersBySubject(currentUser.getId(), subjectId));
    }

    // ==================== Practice Paper Operations ====================

    @PostMapping("/practice")
    public ResponseEntity<PaperDto> createPracticePaper(
            @Valid @RequestBody PaperCreateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        PaperDto paper = paperService.createPracticePaper(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(paper);
    }

    @GetMapping("/practice")
    public ResponseEntity<PagedResponse<PaperDto>> getMyPracticePapers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(paperService.getTeacherPracticePapers(currentUser.getId(), page, size));
    }

    @GetMapping("/practice/{paperId}")
    public ResponseEntity<PaperDetailDto> getPracticePaperDetail(
            @PathVariable UUID paperId,
            @CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(paperService.getTeacherPracticePaperDetail(paperId, currentUser.getId()));
    }

    @PostMapping("/practice/{paperId}/submit")
    public ResponseEntity<PaperDto> submitForApproval(
            @PathVariable UUID paperId,
            @CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(paperService.submitPracticePaperForApproval(paperId, currentUser.getId()));
    }
}
