package com.piriven.mcq.question.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.question.dto.QuestionCreateRequest;
import com.piriven.mcq.question.dto.QuestionDto;
import com.piriven.mcq.question.dto.QuestionUpdateRequest;
import com.piriven.mcq.question.service.QuestionService;
import com.piriven.mcq.security.CurrentUser;
import com.piriven.mcq.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/teacher/questions")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherQuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(
            @Valid @RequestBody QuestionCreateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDto question = questionService.createQuestion(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(
            @PathVariable UUID id,
            @Valid @RequestBody QuestionUpdateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDto question = questionService.updateQuestion(id, request, currentUser.getId());
        return ResponseEntity.ok(question);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuestionDto> submitForReview(
            @PathVariable UUID id,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDto question = questionService.submitForReview(id, currentUser.getId());
        return ResponseEntity.ok(question);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<QuestionDto>> getMyQuestions(
            @CurrentUser UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<QuestionDto> response = questionService.getTeacherQuestions(
                currentUser.getId(), page, size);
        return ResponseEntity.ok(response);
    }
}
