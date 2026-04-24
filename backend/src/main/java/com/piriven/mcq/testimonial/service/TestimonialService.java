package com.piriven.mcq.testimonial.service;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.testimonial.dto.*;
import com.piriven.mcq.testimonial.entity.Testimonial;
import com.piriven.mcq.testimonial.repository.TestimonialRepository;
import com.piriven.mcq.testimonial.util.ImageOptimizer;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;
    private final UserRepository userRepository;

    /* ── Admin: Enable/Disable form ── */

    @Transactional
    public void enableForm(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("පරිශීලකයා හමු නොවීය"));

        Testimonial testimonial = testimonialRepository.findByUserId(userId)
                .orElseGet(() -> Testimonial.builder().user(user).build());
        testimonial.setFormEnabled(true);
        testimonialRepository.save(testimonial);
    }

    @Transactional
    public void disableForm(UUID userId) {
        testimonialRepository.findByUserId(userId).ifPresent(t -> {
            t.setFormEnabled(false);
            testimonialRepository.save(t);
        });
    }

    /* ── Admin: View & Manage ── */

    @Transactional(readOnly = true)
    public PagedResponse<TestimonialDto> getAll(int page, int size) {
        Page<Testimonial> p = testimonialRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return toPagedResponse(p);
    }

    @Transactional(readOnly = true)
    public PagedResponse<TestimonialDto> getSubmitted(int page, int size) {
        Page<Testimonial> p = testimonialRepository.findAllSubmitted(PageRequest.of(page, size));
        return toPagedResponse(p);
    }

    @Transactional(readOnly = true)
    public List<TestimonialDto> getFormEnabledUsers() {
        return testimonialRepository.findAllFormEnabled().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public TestimonialDto updateTestimonial(UUID id, UpdateTestimonialRequest req) {
        Testimonial t = testimonialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("අදහස හමු නොවීය"));

        if (req.quote() != null)
            t.setQuote(req.quote());
        if (req.positionTitle() != null)
            t.setPositionTitle(req.positionTitle());
        if (req.rating() != null)
            t.setRating(req.rating());
        if (req.isPublished() != null)
            t.setPublished(req.isPublished());

        return toDto(testimonialRepository.save(t));
    }

    @Transactional
    public TestimonialDto togglePublish(UUID id) {
        Testimonial t = testimonialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("අදහස හමු නොවීය"));
        t.setPublished(!t.isPublished());
        return toDto(testimonialRepository.save(t));
    }

    @Transactional
    public void deleteTestimonial(UUID id) {
        testimonialRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Testimonial getTestimonialWithPhoto(UUID id) {
        return testimonialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("අදහස හමු නොවීය"));
    }

    /* ── User: Status & Submit ── */

    @Transactional(readOnly = true)
    public TestimonialStatusDto getStatus(UUID userId) {
        return testimonialRepository.findByUserId(userId)
                .map(t -> new TestimonialStatusDto(t.isFormEnabled(), t.isSubmitted()))
                .orElse(new TestimonialStatusDto(false, false));
    }

    @Transactional
    public void submitTestimonial(UUID userId, SubmitTestimonialRequest req, MultipartFile photo) {
        Testimonial t = testimonialRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Feedback form එක enable කර නොමැත"));

        if (!t.isFormEnabled()) {
            throw new RuntimeException("Feedback form එක enable කර නොමැත");
        }

        t.setQuote(req.quote());
        t.setPositionTitle(req.positionTitle());
        t.setRating(req.rating());

        if (photo != null && !photo.isEmpty()) {
            try {
                byte[] optimized = ImageOptimizer.optimizeProfilePhoto(photo.getBytes());
                t.setPhotoData(optimized);
                t.setPhotoContentType("image/jpeg");
            } catch (IOException e) {
                throw new RuntimeException("ඡායාරූපය process කිරීමේ දෝෂයකි");
            }
        }

        testimonialRepository.save(t);
    }

    /* ── Public ── */

    @Transactional(readOnly = true)
    public List<PublicTestimonialDto> getPublishedTestimonials() {
        return testimonialRepository.findByIsPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toPublicDto)
                .toList();
    }

    /* ── Mappers ── */

    private TestimonialDto toDto(Testimonial t) {
        return new TestimonialDto(
                t.getId(),
                t.getUser().getId(),
                t.getUser().getFullName(),
                t.getUser().getRole().name(),
                t.getQuote(),
                t.getPositionTitle(),
                t.getRating(),
                t.getPhotoData() != null,
                t.isPublished(),
                t.isFormEnabled(),
                t.isSubmitted(),
                t.getCreatedAt(),
                t.getUpdatedAt());
    }

    private PublicTestimonialDto toPublicDto(Testimonial t) {
        return new PublicTestimonialDto(
                t.getId(),
                t.getUser().getFullName(),
                t.getUser().getRole().name(),
                t.getQuote(),
                t.getPositionTitle(),
                t.getRating(),
                t.getPhotoData() != null,
                t.getCreatedAt());
    }

    private PagedResponse<TestimonialDto> toPagedResponse(Page<Testimonial> p) {
        return PagedResponse.<TestimonialDto>builder()
                .content(p.getContent().stream().map(this::toDto).toList())
                .page(p.getNumber())
                .size(p.getSize())
                .totalElements(p.getTotalElements())
                .totalPages(p.getTotalPages())
                .last(p.isLast())
                .build();
    }
}
