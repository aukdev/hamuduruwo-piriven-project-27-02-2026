package com.piriven.mcq.subject.service;

import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.subject.dto.CreateSubjectRequest;
import com.piriven.mcq.subject.dto.SubjectDto;
import com.piriven.mcq.subject.entity.Subject;
import com.piriven.mcq.subject.entity.TeacherSubject;
import com.piriven.mcq.subject.repository.SubjectRepository;
import com.piriven.mcq.subject.repository.TeacherSubjectRepository;
import com.piriven.mcq.user.entity.Role;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final UserRepository userRepository;

    @Transactional
    public SubjectDto createSubject(CreateSubjectRequest request) {
        if (subjectRepository.existsByName(request.name())) {
            throw new BusinessException("Subject with this name already exists", HttpStatus.CONFLICT);
        }

        Subject subject = Subject.builder()
                .name(request.name())
                .description(request.description())
                .build();

        subject = subjectRepository.save(subject);
        return toDto(subject);
    }

    @Transactional(readOnly = true)
    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void assignSubjectToTeacher(UUID teacherId, UUID subjectId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));

        if (teacher.getRole() != Role.TEACHER) {
            throw new BusinessException("User is not a teacher");
        }

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", subjectId));

        if (teacherSubjectRepository.existsByTeacherIdAndSubjectId(teacherId, subjectId)) {
            throw new BusinessException("Subject is already assigned to this teacher", HttpStatus.CONFLICT);
        }

        TeacherSubject ts = TeacherSubject.builder()
                .teacher(teacher)
                .subject(subject)
                .build();

        teacherSubjectRepository.save(ts);
    }

    @Transactional(readOnly = true)
    public List<SubjectDto> getTeacherSubjects(UUID teacherId) {
        return teacherSubjectRepository.findByTeacherId(teacherId).stream()
                .map(ts -> toDto(ts.getSubject()))
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isTeacherAssignedToSubject(UUID teacherId, UUID subjectId) {
        return teacherSubjectRepository.existsByTeacherIdAndSubjectId(teacherId, subjectId);
    }

    private SubjectDto toDto(Subject subject) {
        return new SubjectDto(
                subject.getId(),
                subject.getName(),
                subject.getDescription(),
                subject.getCreatedAt());
    }
}
