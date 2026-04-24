package com.piriven.mcq.subject.controller;

import com.piriven.mcq.security.CurrentUser;
import com.piriven.mcq.security.UserPrincipal;
import com.piriven.mcq.subject.dto.SubjectDto;
import com.piriven.mcq.subject.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/subjects")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherSubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<SubjectDto>> getMySubjects(@CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(subjectService.getTeacherSubjects(currentUser.getId()));
    }
}
