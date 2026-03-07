package com.piriven.mcq.subject.controller;

import com.piriven.mcq.subject.dto.CreateSubjectRequest;
import com.piriven.mcq.subject.dto.SubjectDto;
import com.piriven.mcq.subject.dto.UpdateSubjectRequest;
import com.piriven.mcq.subject.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminSubjectController {

    private final SubjectService subjectService;

    @PostMapping("/subjects")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<SubjectDto> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        SubjectDto subject = subjectService.createSubject(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(subject);
    }

    @PutMapping("/subjects/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<SubjectDto> updateSubject(@PathVariable UUID id,
            @Valid @RequestBody UpdateSubjectRequest request) {
        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @DeleteMapping("/subjects/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Void> deleteSubject(@PathVariable UUID id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/teachers/{teacherId}/subjects/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> assignSubjectToTeacher(
            @PathVariable UUID teacherId,
            @PathVariable UUID subjectId) {
        subjectService.assignSubjectToTeacher(teacherId, subjectId);
        return ResponseEntity.ok(Map.of("message", "Subject assigned to teacher successfully"));
    }
}
