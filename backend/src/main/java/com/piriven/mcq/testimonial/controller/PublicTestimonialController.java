package com.piriven.mcq.testimonial.controller;

import com.piriven.mcq.testimonial.dto.PublicTestimonialDto;
import com.piriven.mcq.testimonial.entity.Testimonial;
import com.piriven.mcq.testimonial.service.TestimonialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/testimonials")
@RequiredArgsConstructor
public class PublicTestimonialController {

    private final TestimonialService testimonialService;

    @GetMapping
    public ResponseEntity<List<PublicTestimonialDto>> getPublished() {
        return ResponseEntity.ok(testimonialService.getPublishedTestimonials());
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getPhoto(@PathVariable UUID id) {
        Testimonial t = testimonialService.getTestimonialWithPhoto(id);
        if (t.getPhotoData() == null || !t.isPublished()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        t.getPhotoContentType() != null ? t.getPhotoContentType() : "image/jpeg"))
                .body(t.getPhotoData());
    }
}
