package com.piriven.mcq.attempt.controller;

import com.piriven.mcq.attempt.dto.*;
import com.piriven.mcq.attempt.service.AttemptService;
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
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentAttemptController {

    private final AttemptService attemptService;

    @PostMapping("/papers/{paperId}/attempts/start")
    public ResponseEntity<AttemptStartResponse> startAttempt(
            @PathVariable UUID paperId,
            @CurrentUser UserPrincipal currentUser) {
        AttemptStartResponse response = attemptService.startAttempt(paperId, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/attempts/{attemptId}/next-question")
    public ResponseEntity<NextQuestionResponse> getNextQuestion(
            @PathVariable UUID attemptId,
            @CurrentUser UserPrincipal currentUser) {
        NextQuestionResponse response = attemptService.getNextQuestion(attemptId, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/attempts/{attemptId}/answer")
    public ResponseEntity<AnswerResponse> submitAnswer(
            @PathVariable UUID attemptId,
            @Valid @RequestBody AnswerRequest request,
            @CurrentUser UserPrincipal currentUser) {
        AnswerResponse response = attemptService.submitAnswer(attemptId, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public ResponseEntity<AttemptResultResponse> submitAttempt(
            @PathVariable UUID attemptId,
            @CurrentUser UserPrincipal currentUser) {
        AttemptResultResponse response = attemptService.submitAttempt(attemptId, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/attempts/{attemptId}/result")
    public ResponseEntity<AttemptResultResponse> getResult(
            @PathVariable UUID attemptId,
            @CurrentUser UserPrincipal currentUser) {
        AttemptResultResponse response = attemptService.getResult(attemptId, currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
