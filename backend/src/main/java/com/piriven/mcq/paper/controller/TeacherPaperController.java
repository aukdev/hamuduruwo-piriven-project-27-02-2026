package com.piriven.mcq.paper.controller;

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

    @GetMapping("/{paperId}")
    public ResponseEntity<PaperDetailDto> getPaperDetail(
            @PathVariable UUID paperId,
            @CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(paperService.getTeacherPaperDetail(paperId, currentUser.getId()));
    }

    @PutMapping("/{paperId}")
    public ResponseEntity<PaperDto> updatePaper(
            @PathVariable UUID paperId,
            @Valid @RequestBody PaperUpdateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(paperService.updatePaperByTeacher(paperId, request, currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<PaperDto> createPaper(
            @Valid @RequestBody PaperCreateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        PaperDto paper = paperService.createPaperByTeacher(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(paper);
    }
}
