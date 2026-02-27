package com.piriven.mcq.question.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.question.dto.QuestionDto;
import com.piriven.mcq.question.dto.QuestionRejectRequest;
import com.piriven.mcq.question.service.QuestionService;
import com.piriven.mcq.security.CurrentUser;
import com.piriven.mcq.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/questions")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminQuestionController {

    private final QuestionService questionService;

    @GetMapping("/pending")
    public ResponseEntity<PagedResponse<QuestionDto>> getPendingQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<QuestionDto> response = questionService.getPendingQuestions(page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<QuestionDto> approveQuestion(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDto question = questionService.approveQuestion(id, currentUser.getId());
        return ResponseEntity.ok(question);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<QuestionDto> rejectQuestion(
            @PathVariable UUID id,
            @Valid @RequestBody QuestionRejectRequest request,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDto question = questionService.rejectQuestion(id, request.reason(), currentUser.getId());
        return ResponseEntity.ok(question);
    }
}
