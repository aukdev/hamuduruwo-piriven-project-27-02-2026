package com.piriven.mcq.paper.service;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.paper.dto.*;
import com.piriven.mcq.paper.entity.Paper;
import com.piriven.mcq.paper.entity.PaperQuestion;
import com.piriven.mcq.paper.entity.PaperStatus;
import com.piriven.mcq.paper.entity.PaperType;
import com.piriven.mcq.paper.repository.PaperQuestionRepository;
import com.piriven.mcq.paper.repository.PaperRepository;
import com.piriven.mcq.question.dto.QuestionOptionRequest;
import com.piriven.mcq.question.entity.Question;
import com.piriven.mcq.question.entity.QuestionOption;
import com.piriven.mcq.question.entity.QuestionStatus;
import com.piriven.mcq.question.repository.QuestionRepository;
import com.piriven.mcq.subject.dto.SubjectDto;
import com.piriven.mcq.subject.entity.Subject;
import com.piriven.mcq.subject.repository.SubjectRepository;
import com.piriven.mcq.subject.service.SubjectService;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaperService {

    private final PaperRepository paperRepository;
    private final PaperQuestionRepository paperQuestionRepository;
    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final SubjectService subjectService;

    // ==================== Past Paper Operations (Admin/SuperAdmin)
    // ====================

    @Transactional(readOnly = true)
    public List<Integer> getAvailableYears() {
        return paperRepository.findDistinctYearsByPaperType(PaperType.PAST_PAPER);
    }

    @Transactional(readOnly = true)
    public List<PaperDto> getPapersByYear(int year) {
        List<Paper> papers = paperRepository.findByYearAndPaperTypeWithSubject(year, PaperType.PAST_PAPER);
        return papers.stream().map(this::toDto).toList();
    }

    @Transactional
    public PaperDto createPaper(PaperCreateRequest request) {
        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.subjectId()));

        if (request.year() == null) {
            throw new BusinessException("Year is required for past papers");
        }

        if (paperRepository.existsByYearAndSubjectIdAndPaperType(request.year(), request.subjectId(),
                PaperType.PAST_PAPER)) {
            throw new BusinessException(
                    "Paper already exists for year " + request.year() + " and subject '" + subject.getName() + "'",
                    HttpStatus.CONFLICT);
        }

        Paper paper = Paper.builder()
                .year(request.year())
                .subject(subject)
                .paperType(PaperType.PAST_PAPER)
                .status(PaperStatus.APPROVED)
                .durationSeconds(request.durationSeconds() > 0 ? request.durationSeconds() : 1200)
                .questionCount(request.questionCount())
                .build();

        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    // ==================== Paper Detail & Question Management ====================

    @Transactional(readOnly = true)
    public PaperDetailDto getPaperDetail(UUID paperId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        List<PaperQuestion> pqs = paperQuestionRepository.findByPaperIdOrderByPosition(paperId);

        List<PaperDetailDto.PaperQuestionInfo> questions = pqs.stream()
                .map(pq -> {
                    List<PaperDetailDto.OptionInfo> optionInfos = pq.getQuestion().getOptions().stream()
                            .map(o -> new PaperDetailDto.OptionInfo(
                                    o.getId(), o.getOptionText(), o.getOptionOrder(), o.isCorrect()))
                            .toList();
                    return new PaperDetailDto.PaperQuestionInfo(
                            pq.getPosition(),
                            pq.getQuestion().getId(),
                            pq.getQuestion().getQuestionText(),
                            optionInfos);
                })
                .toList();

        return new PaperDetailDto(
                paper.getId(),
                paper.getYear(),
                paper.getSubject().getId(),
                paper.getSubject().getName(),
                paper.getDurationSeconds(),
                paper.getQuestionCount(),
                paper.getPaperType().name(),
                paper.getTitle(),
                paper.getStatus().name(),
                questions);
    }

    @Transactional
    public void assignQuestionToPaper(UUID paperId, PaperQuestionAssignRequest request) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", request.questionId()));

        if (question.getStatus() != QuestionStatus.APPROVED) {
            throw new BusinessException("Only APPROVED questions can be assigned to papers");
        }

        long currentCount = paperQuestionRepository.countByPaperId(paperId);
        if (currentCount >= paper.getQuestionCount()) {
            throw new BusinessException("Paper already has the maximum number of questions (" +
                    paper.getQuestionCount() + ") assigned", HttpStatus.CONFLICT);
        }

        if (request.position() > paper.getQuestionCount()) {
            throw new BusinessException("Position " + request.position() +
                    " exceeds paper question count (" + paper.getQuestionCount() + ")");
        }

        if (paperQuestionRepository.existsByPaperIdAndPosition(paperId, request.position())) {
            throw new BusinessException("Position " + request.position() + " is already occupied for this paper",
                    HttpStatus.CONFLICT);
        }

        if (paperQuestionRepository.existsByPaperIdAndQuestionId(paperId, request.questionId())) {
            throw new BusinessException("This question is already assigned to this paper", HttpStatus.CONFLICT);
        }

        PaperQuestion pq = PaperQuestion.builder()
                .paper(paper)
                .question(question)
                .position(request.position())
                .build();

        paperQuestionRepository.save(pq);
    }

    @Transactional
    public PaperDetailDto createQuestionForPaper(UUID paperId, PaperQuestionCreateRequest request, UUID userId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        long currentCount = paperQuestionRepository.countByPaperId(paperId);
        if (currentCount >= paper.getQuestionCount()) {
            throw new BusinessException("Paper already has the maximum number of questions (" +
                    paper.getQuestionCount() + ") assigned", HttpStatus.CONFLICT);
        }

        validateOptions(request.options());

        Question question = Question.builder()
                .subject(paper.getSubject())
                .createdBy(creator)
                .questionText(request.questionText())
                .year(paper.getYear())
                .paper(paper)
                .status(QuestionStatus.APPROVED)
                .approvedBy(creator)
                .approvedAt(LocalDateTime.now())
                .build();

        for (QuestionOptionRequest optReq : request.options()) {
            QuestionOption option = QuestionOption.builder()
                    .optionText(optReq.optionText())
                    .isCorrect(optReq.isCorrect())
                    .optionOrder(optReq.optionOrder())
                    .build();
            question.addOption(option);
        }

        question = questionRepository.save(question);

        int nextPosition = (int) currentCount + 1;
        PaperQuestion pq = PaperQuestion.builder()
                .paper(paper)
                .question(question)
                .position(nextPosition)
                .build();
        paperQuestionRepository.save(pq);

        return getPaperDetail(paperId);
    }

    @Transactional
    public void removeQuestionFromPaper(UUID paperId, UUID questionId) {
        paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        PaperQuestion pq = paperQuestionRepository.findByPaperIdAndQuestionId(paperId, questionId)
                .orElseThrow(() -> new BusinessException("Question is not assigned to this paper"));

        paperQuestionRepository.delete(pq);

        List<PaperQuestion> remaining = paperQuestionRepository.findByPaperIdOrderByPosition(paperId);
        int pos = 1;
        for (PaperQuestion rpq : remaining) {
            if (rpq.getPosition() != pos) {
                rpq.setPosition(pos);
                paperQuestionRepository.save(rpq);
            }
            pos++;
        }
    }

    @Transactional
    public PaperDto updatePaper(UUID paperId, PaperUpdateRequest request) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        long assignedCount = paperQuestionRepository.countByPaperId(paperId);
        if (request.questionCount() < assignedCount) {
            throw new BusinessException(
                    "Cannot reduce question count below assigned questions (" + assignedCount + ")",
                    HttpStatus.CONFLICT);
        }

        paper.setQuestionCount(request.questionCount());
        paper.setDurationSeconds(request.durationSeconds());
        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    @Transactional
    public void deletePaper(UUID paperId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));
        paperRepository.delete(paper);
    }

    // ==================== Practice Paper Operations (Teacher) ====================

    @Transactional
    public PaperDto createPracticePaper(PaperCreateRequest request, UUID teacherId) {
        if (request.title() == null || request.title().isBlank()) {
            throw new BusinessException("Title is required for practice papers");
        }

        if (!subjectService.isTeacherAssignedToSubject(teacherId, request.subjectId())) {
            throw new BusinessException("Teacher is not assigned to this subject", HttpStatus.FORBIDDEN);
        }

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.subjectId()));

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", teacherId));

        Paper paper = Paper.builder()
                .subject(subject)
                .paperType(PaperType.PRACTICE)
                .title(request.title())
                .status(PaperStatus.DRAFT)
                .createdBy(teacher)
                .durationSeconds(request.durationSeconds() > 0 ? request.durationSeconds() : 1200)
                .questionCount(request.questionCount())
                .build();

        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    @Transactional
    public PaperDto submitPracticePaperForApproval(UUID paperId, UUID teacherId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        if (paper.getPaperType() != PaperType.PRACTICE) {
            throw new BusinessException("Only practice papers can be submitted for approval");
        }

        if (paper.getCreatedBy() == null || !paper.getCreatedBy().getId().equals(teacherId)) {
            throw new BusinessException("You can only submit your own practice papers", HttpStatus.FORBIDDEN);
        }

        if (paper.getStatus() != PaperStatus.DRAFT && paper.getStatus() != PaperStatus.REJECTED) {
            throw new BusinessException("Only DRAFT or REJECTED papers can be submitted for approval");
        }

        long assignedCount = paperQuestionRepository.countByPaperId(paperId);
        if (assignedCount < paper.getQuestionCount()) {
            throw new BusinessException("Paper must have all " + paper.getQuestionCount() +
                    " questions assigned before submission. Currently has " + assignedCount);
        }

        paper.setStatus(PaperStatus.PENDING_APPROVAL);
        paper.setRejectionReason(null);
        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PaperDto> getTeacherPracticePapers(UUID teacherId, int page, int size) {
        Page<Paper> paperPage = paperRepository.findByCreatedByIdAndPaperType(
                teacherId, PaperType.PRACTICE, PageRequest.of(page, Math.min(size, 100)));
        return buildPagedResponse(paperPage);
    }

    @Transactional(readOnly = true)
    public PaperDetailDto getTeacherPracticePaperDetail(UUID paperId, UUID teacherId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        if (paper.getPaperType() != PaperType.PRACTICE) {
            throw new BusinessException("Paper is not a practice paper");
        }

        if (paper.getCreatedBy() == null || !paper.getCreatedBy().getId().equals(teacherId)) {
            throw new BusinessException("You can only view your own practice papers", HttpStatus.FORBIDDEN);
        }

        return getPaperDetail(paperId);
    }

    // ==================== Practice Paper Approval (Admin/SuperAdmin)
    // ====================

    @Transactional(readOnly = true)
    public PagedResponse<PaperDto> getPendingPracticePapers(int page, int size) {
        Page<Paper> paperPage = paperRepository.findByPaperTypeAndStatus(
                PaperType.PRACTICE, PaperStatus.PENDING_APPROVAL, PageRequest.of(page, Math.min(size, 100)));
        return buildPagedResponse(paperPage);
    }

    @Transactional
    public PaperDto approvePracticePaper(UUID paperId, UUID adminId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        if (paper.getPaperType() != PaperType.PRACTICE) {
            throw new BusinessException("Only practice papers can be approved through this endpoint");
        }

        if (paper.getStatus() != PaperStatus.PENDING_APPROVAL) {
            throw new BusinessException("Only PENDING_APPROVAL papers can be approved");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminId));

        paper.setStatus(PaperStatus.APPROVED);
        paper.setApprovedBy(admin);
        paper.setApprovedAt(LocalDateTime.now());
        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    @Transactional
    public PaperDto rejectPracticePaper(UUID paperId, String reason, UUID adminId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        if (paper.getPaperType() != PaperType.PRACTICE) {
            throw new BusinessException("Only practice papers can be rejected through this endpoint");
        }

        if (paper.getStatus() != PaperStatus.PENDING_APPROVAL) {
            throw new BusinessException("Only PENDING_APPROVAL papers can be rejected");
        }

        paper.setStatus(PaperStatus.REJECTED);
        paper.setRejectionReason(reason);
        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    // ==================== Student Operations ====================

    @Transactional(readOnly = true)
    public List<SubjectDto> getSubjectsWithApprovedPracticePapers() {
        List<Subject> subjects = paperRepository.findDistinctSubjectsByPaperTypeAndStatus(
                PaperType.PRACTICE, PaperStatus.APPROVED);
        return subjects.stream()
                .map(s -> new SubjectDto(s.getId(), s.getName(), s.getDescription(), s.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PaperDto> getApprovedPracticePapersBySubject(UUID subjectId) {
        List<Paper> papers = paperRepository.findBySubjectIdAndPaperTypeAndStatus(
                subjectId, PaperType.PRACTICE, PaperStatus.APPROVED);
        return papers.stream().map(this::toDto).toList();
    }

    // ==================== Teacher Past Paper Operations ====================

    @Transactional(readOnly = true)
    public List<PaperDto> getTeacherPapers(UUID teacherId) {
        List<UUID> subjectIds = subjectService.getTeacherSubjectIds(teacherId);
        if (subjectIds.isEmpty()) {
            return List.of();
        }
        List<Paper> papers = paperRepository.findBySubjectIdInAndPaperType(subjectIds, PaperType.PAST_PAPER);
        return papers.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PaperDto> getTeacherPapersBySubject(UUID teacherId, UUID subjectId) {
        if (!subjectService.isTeacherAssignedToSubject(teacherId, subjectId)) {
            throw new BusinessException("Teacher is not assigned to this subject", HttpStatus.FORBIDDEN);
        }
        List<Paper> papers = paperRepository.findBySubjectIdWithSubject(subjectId);
        return papers.stream().map(this::toDto).toList();
    }

    @Transactional
    public PaperDto updatePaperByTeacher(UUID paperId, PaperUpdateRequest request, UUID teacherId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        // For practice papers, teacher must own it
        if (paper.getPaperType() == PaperType.PRACTICE) {
            if (paper.getCreatedBy() == null || !paper.getCreatedBy().getId().equals(teacherId)) {
                throw new BusinessException("You can only update your own practice papers", HttpStatus.FORBIDDEN);
            }
            if (paper.getStatus() != PaperStatus.DRAFT && paper.getStatus() != PaperStatus.REJECTED) {
                throw new BusinessException("Can only update DRAFT or REJECTED practice papers");
            }
        } else {
            // For past papers, teacher must be assigned to subject
            if (!subjectService.isTeacherAssignedToSubject(teacherId, paper.getSubject().getId())) {
                throw new BusinessException("Teacher is not assigned to this paper's subject", HttpStatus.FORBIDDEN);
            }
        }

        long assignedCount = paperQuestionRepository.countByPaperId(paperId);
        if (request.questionCount() < assignedCount) {
            throw new BusinessException(
                    "Cannot reduce question count below assigned questions (" + assignedCount + ")",
                    HttpStatus.CONFLICT);
        }

        paper.setQuestionCount(request.questionCount());
        paper.setDurationSeconds(request.durationSeconds());
        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    @Transactional
    public PaperDto createPaperByTeacher(PaperCreateRequest request, UUID teacherId) {
        if (!subjectService.isTeacherAssignedToSubject(teacherId, request.subjectId())) {
            throw new BusinessException("Teacher is not assigned to this subject", HttpStatus.FORBIDDEN);
        }

        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.subjectId()));

        if (request.year() != null && paperRepository.existsByYearAndSubjectIdAndPaperType(request.year(),
                request.subjectId(), PaperType.PAST_PAPER)) {
            throw new BusinessException(
                    "Paper already exists for year " + request.year() + " and subject '" + subject.getName() + "'",
                    HttpStatus.CONFLICT);
        }

        Paper paper = Paper.builder()
                .year(request.year())
                .subject(subject)
                .paperType(PaperType.PAST_PAPER)
                .status(PaperStatus.APPROVED)
                .durationSeconds(request.durationSeconds() > 0 ? request.durationSeconds() : 1200)
                .questionCount(request.questionCount())
                .build();

        paper = paperRepository.save(paper);
        return toDto(paper);
    }

    @Transactional(readOnly = true)
    public PaperDetailDto getTeacherPaperDetail(UUID paperId, UUID teacherId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        if (!subjectService.isTeacherAssignedToSubject(teacherId, paper.getSubject().getId())) {
            throw new BusinessException("Teacher is not assigned to this paper's subject", HttpStatus.FORBIDDEN);
        }

        return getPaperDetail(paperId);
    }

    // ==================== Helpers ====================

    private void validateOptions(List<QuestionOptionRequest> options) {
        if (options.size() != 4) {
            throw new BusinessException("Exactly 4 options are required");
        }
        long correctCount = options.stream().filter(QuestionOptionRequest::isCorrect).count();
        if (correctCount != 1) {
            throw new BusinessException("Exactly 1 option must be marked as correct");
        }
        var orders = options.stream().map(QuestionOptionRequest::optionOrder).sorted().toList();
        if (!orders.equals(List.of(1, 2, 3, 4))) {
            throw new BusinessException("Options must have unique order values 1, 2, 3, 4");
        }
    }

    private PaperDto toDto(Paper paper) {
        long assigned = paperQuestionRepository.countByPaperId(paper.getId());
        String createdByEmail = paper.getCreatedBy() != null ? paper.getCreatedBy().getEmail() : null;
        String createdByName = paper.getCreatedBy() != null ? paper.getCreatedBy().getFullName() : null;
        return new PaperDto(
                paper.getId(),
                paper.getYear(),
                paper.getSubject().getId(),
                paper.getSubject().getName(),
                paper.getDurationSeconds(),
                paper.getQuestionCount(),
                assigned,
                paper.getPaperType().name(),
                paper.getTitle(),
                paper.getStatus().name(),
                createdByEmail,
                createdByName);
    }

    private PagedResponse<PaperDto> buildPagedResponse(Page<Paper> paperPage) {
        List<PaperDto> content = paperPage.getContent().stream().map(this::toDto).toList();
        return PagedResponse.<PaperDto>builder()
                .content(content)
                .page(paperPage.getNumber())
                .size(paperPage.getSize())
                .totalElements(paperPage.getTotalElements())
                .totalPages(paperPage.getTotalPages())
                .last(paperPage.isLast())
                .build();
    }
}
