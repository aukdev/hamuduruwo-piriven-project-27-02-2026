package com.piriven.mcq.paper.controller;

import com.piriven.mcq.paper.dto.PaperDetailDto;
import com.piriven.mcq.paper.dto.PaperQuestionAssignRequest;
import com.piriven.mcq.paper.service.PaperService;
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

    @GetMapping("/{paperId}")
    public ResponseEntity<PaperDetailDto> getPaperDetail(@PathVariable UUID paperId) {
        return ResponseEntity.ok(paperService.getPaperDetail(paperId));
    }

    @PostMapping("/{paperId}/questions")
    public ResponseEntity<Map<String, String>> assignQuestion(
            @PathVariable UUID paperId,
            @Valid @RequestBody PaperQuestionAssignRequest request) {
        paperService.assignQuestionToPaper(paperId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Question assigned to paper successfully"));
    }
}
