package com.piriven.mcq.vichara.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.security.CurrentUser;
import com.piriven.mcq.security.UserPrincipal;
import com.piriven.mcq.vichara.dto.*;
import com.piriven.mcq.vichara.service.VcharaService;
import com.piriven.mcq.vichara.service.VcharaSubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/vichara")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminVcharaController {

    private final VcharaSubjectService subjectService;
    private final VcharaService vcharaService;

    /* ── Vichara Subjects ── */

    @GetMapping("/subjects")
    public ResponseEntity<List<VcharaSubjectDto>> getSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @PostMapping("/subjects")
    public ResponseEntity<VcharaSubjectDto> createSubject(
            @Valid @RequestBody CreateVcharaSubjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subjectService.createSubject(request));
    }

    @PutMapping("/subjects/{id}")
    public ResponseEntity<VcharaSubjectDto> updateSubject(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVcharaSubjectRequest request) {
        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable UUID id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    /* ── Vicharas ── */

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

    @PostMapping
    public ResponseEntity<VcharaDto> createVichara(
            @Valid @RequestBody CreateVcharaRequest request,
            @CurrentUser UserPrincipal user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vcharaService.createVichara(request, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VcharaDto> updateVichara(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVcharaRequest request) {
        return ResponseEntity.ok(vcharaService.updateVichara(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVichara(@PathVariable UUID id) {
        vcharaService.deleteVichara(id);
        return ResponseEntity.noContent().build();
    }
}
