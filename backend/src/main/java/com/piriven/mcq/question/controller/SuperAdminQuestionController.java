package com.piriven.mcq.question.controller;

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
@RequestMapping("/api/superadmin/questions")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@RequiredArgsConstructor
public class SuperAdminQuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(
            @Valid @RequestBody QuestionCreateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDto question = questionService.superAdminCreateQuestion(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(
            @PathVariable UUID id,
            @Valid @RequestBody QuestionUpdateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        QuestionDto question = questionService.superAdminUpdateQuestion(id, request, currentUser.getId());
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable UUID id) {
        questionService.superAdminDeleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
