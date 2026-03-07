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

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/papers")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminPaperController {

    private final PaperService paperService;

    @PostMapping
    public ResponseEntity<PaperDto> createPaper(
            @Valid @RequestBody PaperCreateRequest request) {
        PaperDto paper = paperService.createPaper(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(paper);
    }

    @GetMapping("/{paperId}")
    public ResponseEntity<PaperDetailDto> getPaperDetail(@PathVariable UUID paperId) {
        return ResponseEntity.ok(paperService.getPaperDetail(paperId));
    }

    @PutMapping("/{paperId}")
    public ResponseEntity<PaperDto> updatePaper(
            @PathVariable UUID paperId,
            @Valid @RequestBody PaperUpdateRequest request) {
        PaperDto paper = paperService.updatePaper(paperId, request);
        return ResponseEntity.ok(paper);
    }

    @DeleteMapping("/{paperId}")
    public ResponseEntity<Void> deletePaper(@PathVariable UUID paperId) {
        paperService.deletePaper(paperId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{paperId}/questions")
    public ResponseEntity<Map<String, String>> assignQuestion(
            @PathVariable UUID paperId,
            @Valid @RequestBody PaperQuestionAssignRequest request) {
        paperService.assignQuestionToPaper(paperId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Question assigned to paper successfully"));
    }

    @PostMapping("/{paperId}/questions/create")
    public ResponseEntity<PaperDetailDto> createQuestionForPaper(
            @PathVariable UUID paperId,
            @Valid @RequestBody PaperQuestionCreateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        PaperDetailDto detail = paperService.createQuestionForPaper(paperId, request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(detail);
    }

    @DeleteMapping("/{paperId}/questions/{questionId}")
    public ResponseEntity<Void> removeQuestionFromPaper(
            @PathVariable UUID paperId,
            @PathVariable UUID questionId) {
        paperService.removeQuestionFromPaper(paperId, questionId);
        return ResponseEntity.noContent().build();
    }
}
