package com.piriven.mcq.testimonial.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.testimonial.dto.TestimonialDto;
import com.piriven.mcq.testimonial.dto.UpdateTestimonialRequest;
import com.piriven.mcq.testimonial.entity.Testimonial;
import com.piriven.mcq.testimonial.service.TestimonialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/testimonials")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminTestimonialController {

    private final TestimonialService testimonialService;

    @PostMapping("/enable/{userId}")
    public ResponseEntity<Void> enableForm(@PathVariable UUID userId) {
        testimonialService.enableForm(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/disable/{userId}")
    public ResponseEntity<Void> disableForm(@PathVariable UUID userId) {
        testimonialService.disableForm(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<PagedResponse<TestimonialDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(testimonialService.getAll(page, size));
    }

    @GetMapping("/submitted")
    public ResponseEntity<PagedResponse<TestimonialDto>> getSubmitted(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(testimonialService.getSubmitted(page, size));
    }

    @GetMapping("/enabled-users")
    public ResponseEntity<List<TestimonialDto>> getFormEnabledUsers() {
        return ResponseEntity.ok(testimonialService.getFormEnabledUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestimonialDto> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTestimonialRequest request) {
        return ResponseEntity.ok(testimonialService.updateTestimonial(id, request));
    }

    @PutMapping("/{id}/toggle-publish")
    public ResponseEntity<TestimonialDto> togglePublish(@PathVariable UUID id) {
        return ResponseEntity.ok(testimonialService.togglePublish(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        testimonialService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getPhoto(@PathVariable UUID id) {
        Testimonial t = testimonialService.getTestimonialWithPhoto(id);
        if (t.getPhotoData() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        t.getPhotoContentType() != null ? t.getPhotoContentType() : "image/jpeg"))
                .body(t.getPhotoData());
    }
}
