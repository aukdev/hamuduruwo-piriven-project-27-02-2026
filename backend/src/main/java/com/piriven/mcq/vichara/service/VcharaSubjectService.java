package com.piriven.mcq.vichara.service;

import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.vichara.dto.CreateVcharaSubjectRequest;
import com.piriven.mcq.vichara.dto.UpdateVcharaSubjectRequest;
import com.piriven.mcq.vichara.dto.VcharaSubjectDto;
import com.piriven.mcq.vichara.entity.VcharaSubject;
import com.piriven.mcq.vichara.repository.VcharaSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VcharaSubjectService {

    private final VcharaSubjectRepository repository;

    @Transactional(readOnly = true)
    public List<VcharaSubjectDto> getAllSubjects() {
        return repository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public VcharaSubjectDto createSubject(CreateVcharaSubjectRequest request) {
        if (repository.existsByName(request.name())) {
            throw new BusinessException("Vichara subject with this name already exists", HttpStatus.CONFLICT);
        }

        VcharaSubject subject = VcharaSubject.builder()
                .name(request.name())
                .description(request.description())
                .displayOrder(request.displayOrder())
                .build();

        subject = repository.save(subject);
        return toDto(subject);
    }

    @Transactional
    public VcharaSubjectDto updateSubject(UUID id, UpdateVcharaSubjectRequest request) {
        VcharaSubject subject = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VcharaSubject", "id", id));

        if (repository.existsByNameAndIdNot(request.name(), id)) {
            throw new BusinessException("Vichara subject with this name already exists", HttpStatus.CONFLICT);
        }

        subject.setName(request.name());
        subject.setDescription(request.description());
        subject.setDisplayOrder(request.displayOrder());
        subject = repository.save(subject);
        return toDto(subject);
    }

    @Transactional
    public void deleteSubject(UUID id) {
        VcharaSubject subject = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VcharaSubject", "id", id));
        repository.delete(subject);
    }

    private VcharaSubjectDto toDto(VcharaSubject s) {
        return new VcharaSubjectDto(
                s.getId(),
                s.getName(),
                s.getDescription(),
                s.getDisplayOrder(),
                s.getCreatedAt());
    }
}
