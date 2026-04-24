package com.piriven.mcq.paper.controller;

import com.piriven.mcq.paper.dto.PaperDto;
import com.piriven.mcq.paper.service.PaperService;
import com.piriven.mcq.subject.dto.SubjectDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/papers")
@RequiredArgsConstructor
public class PaperController {

    private final PaperService paperService;

    // ==================== Past Papers ====================

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getAvailableYears() {
        return ResponseEntity.ok(paperService.getAvailableYears());
    }

    @GetMapping
    public ResponseEntity<List<PaperDto>> getPapersByYear(@RequestParam int year) {
        return ResponseEntity.ok(paperService.getPapersByYear(year));
    }

    // ==================== Practice Papers ====================

    @GetMapping("/practice/subjects")
    public ResponseEntity<List<SubjectDto>> getSubjectsWithPracticePapers() {
        return ResponseEntity.ok(paperService.getSubjectsWithApprovedPracticePapers());
    }

    @GetMapping("/practice")
    public ResponseEntity<List<PaperDto>> getPracticePapersBySubject(@RequestParam UUID subjectId) {
        return ResponseEntity.ok(paperService.getApprovedPracticePapersBySubject(subjectId));
    }
}
