package com.piriven.mcq.vichara.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.vichara.dto.VcharaDto;
import com.piriven.mcq.vichara.dto.VcharaSubjectDto;
import com.piriven.mcq.vichara.service.VcharaService;
import com.piriven.mcq.vichara.service.VcharaSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/vichara")
@RequiredArgsConstructor
public class PublicVcharaController {

    private final VcharaSubjectService subjectService;
    private final VcharaService vcharaService;

    @GetMapping("/subjects")
    public ResponseEntity<List<VcharaSubjectDto>> getSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping
    public ResponseEntity<PagedResponse<VcharaDto>> getVicharas(
            @RequestParam(required = false) UUID subjectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (subjectId != null) {
            return ResponseEntity.ok(vcharaService.getVicharasBySubject(subjectId, page, size));
        }
        return ResponseEntity.ok(vcharaService.getAllVicharas(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VcharaDto> getVichara(@PathVariable UUID id) {
        return ResponseEntity.ok(vcharaService.getVichara(id));
    }
}
