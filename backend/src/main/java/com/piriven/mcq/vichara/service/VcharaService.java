package com.piriven.mcq.vichara.service;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.common.util.HtmlSanitizer;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.repository.UserRepository;
import com.piriven.mcq.vichara.dto.CreateVcharaRequest;
import com.piriven.mcq.vichara.dto.UpdateVcharaRequest;
import com.piriven.mcq.vichara.dto.VcharaDto;
import com.piriven.mcq.vichara.entity.Vichara;
import com.piriven.mcq.vichara.entity.VcharaSubject;
import com.piriven.mcq.vichara.repository.VcharaRepository;
import com.piriven.mcq.vichara.repository.VcharaSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VcharaService {

    private final VcharaRepository vcharaRepository;
    private final VcharaSubjectRepository subjectRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<VcharaDto> getVicharasBySubject(UUID subjectId, int page, int size) {
        Page<Vichara> result = vcharaRepository.findByVcharaSubjectIdOrderByCreatedAtDesc(
                subjectId, PageRequest.of(page, size));
        return toPagedResponse(result);
    }

    @Transactional(readOnly = true)
    public PagedResponse<VcharaDto> getAllVicharas(int page, int size) {
        Page<Vichara> result = vcharaRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return toPagedResponse(result);
    }

    @Transactional(readOnly = true)
    public VcharaDto getVichara(UUID id) {
        Vichara v = vcharaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vichara", "id", id));
        return toDto(v);
    }

    @Transactional
    public VcharaDto createVichara(CreateVcharaRequest request, UUID userId) {
        VcharaSubject subject = subjectRepository.findById(request.vcharaSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("VcharaSubject", "id", request.vcharaSubjectId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String sanitizedContent = HtmlSanitizer.sanitize(request.content());

        Vichara vichara = Vichara.builder()
                .vcharaSubject(subject)
                .title(request.title())
                .content(sanitizedContent)
                .createdBy(user)
                .build();

        vichara = vcharaRepository.save(vichara);
        return toDto(vichara);
    }

    @Transactional
    public VcharaDto updateVichara(UUID id, UpdateVcharaRequest request) {
        Vichara vichara = vcharaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vichara", "id", id));

        VcharaSubject subject = subjectRepository.findById(request.vcharaSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("VcharaSubject", "id", request.vcharaSubjectId()));

        String sanitizedContent = HtmlSanitizer.sanitize(request.content());

        vichara.setVcharaSubject(subject);
        vichara.setTitle(request.title());
        vichara.setContent(sanitizedContent);
        vichara = vcharaRepository.save(vichara);
        return toDto(vichara);
    }

    @Transactional
    public void deleteVichara(UUID id) {
        Vichara vichara = vcharaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vichara", "id", id));
        vcharaRepository.delete(vichara);
    }

    private VcharaDto toDto(Vichara v) {
        return new VcharaDto(
                v.getId(),
                v.getVcharaSubject().getId(),
                v.getVcharaSubject().getName(),
                v.getTitle(),
                v.getContent(),
                v.getCreatedBy().getFullName(),
                v.getCreatedAt(),
                v.getUpdatedAt());
    }

    private PagedResponse<VcharaDto> toPagedResponse(Page<Vichara> page) {
        return PagedResponse.<VcharaDto>builder()
                .content(page.getContent().stream().map(this::toDto).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
