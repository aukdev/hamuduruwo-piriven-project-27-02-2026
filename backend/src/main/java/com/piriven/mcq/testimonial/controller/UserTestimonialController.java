package com.piriven.mcq.testimonial.controller;

import com.piriven.mcq.security.CurrentUser;
import com.piriven.mcq.security.UserPrincipal;
import com.piriven.mcq.testimonial.dto.SubmitTestimonialRequest;
import com.piriven.mcq.testimonial.dto.TestimonialStatusDto;
import com.piriven.mcq.testimonial.service.TestimonialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/testimonials")
@RequiredArgsConstructor
public class UserTestimonialController {

    private final TestimonialService testimonialService;

    @GetMapping("/status")
    public ResponseEntity<TestimonialStatusDto> getStatus(@CurrentUser UserPrincipal currentUser) {
        return ResponseEntity.ok(testimonialService.getStatus(currentUser.getId()));
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submit(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestPart("data") SubmitTestimonialRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo) {
        testimonialService.submitTestimonial(currentUser.getId(), request, photo);
        return ResponseEntity.ok().build();
    }
}
