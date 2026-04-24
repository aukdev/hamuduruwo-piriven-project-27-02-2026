package com.piriven.mcq.question.service;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.common.util.PaginationUtil;
import com.piriven.mcq.paper.entity.Paper;
import com.piriven.mcq.paper.entity.PaperQuestion;
import com.piriven.mcq.paper.entity.PaperType;
import com.piriven.mcq.paper.repository.PaperQuestionRepository;
import com.piriven.mcq.paper.repository.PaperRepository;
import com.piriven.mcq.question.dto.*;
import com.piriven.mcq.question.entity.Question;
import com.piriven.mcq.question.entity.QuestionOption;
import com.piriven.mcq.question.entity.QuestionStatus;
import com.piriven.mcq.question.repository.QuestionRepository;
import com.piriven.mcq.subject.entity.Subject;
import com.piriven.mcq.subject.repository.SubjectRepository;
import com.piriven.mcq.subject.service.SubjectService;
import com.piriven.mcq.user.entity.Role;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final SubjectService subjectService;
    private final PaperRepository paperRepository;
    private final PaperQuestionRepository paperQuestionRepository;

    // ==================== Teacher Operations ====================

    @Transactional
    public QuestionDto createQuestion(QuestionCreateRequest request, UUID teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));

        if (!teacher.isTeacherVerified()) {
            throw new BusinessException("Teacher must be verified before creating questions", HttpStatus.FORBIDDEN);
        }

        if (request.paperId() == null) {
            throw new BusinessException("Paper ID is required");
        }

        Paper paper = paperRepository.findById(request.paperId())
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", request.paperId()));

        Subject subject = paper.getSubject();

        if (!subjectService.isTeacherAssignedToSubject(teacherId, subject.getId())) {
            throw new BusinessException("Teacher is not assigned to this subject", HttpStatus.FORBIDDEN);
        }

        validateOptions(request.options());

        boolean isPracticePaper = paper.getPaperType() == PaperType.PRACTICE;

        // Practice paper questions are auto-approved (paper-level approval is the gate)
        QuestionStatus initialStatus = isPracticePaper ? QuestionStatus.APPROVED : QuestionStatus.DRAFT;

        Question question = Question.builder()
                .subject(subject)
                .createdBy(teacher)
                .questionText(request.questionText())
                .year(paper.getYear())
                .paper(paper)
                .status(initialStatus)
                .approvedBy(isPracticePaper ? teacher : null)
                .approvedAt(isPracticePaper ? LocalDateTime.now() : null)
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

        // Auto-assign to paper_questions for practice papers
        if (isPracticePaper) {
            long currentCount = paperQuestionRepository.countByPaperId(paper.getId());
            if (currentCount < paper.getQuestionCount()) {
                PaperQuestion pq = PaperQuestion.builder()
                        .paper(paper)
                        .question(question)
                        .position((int) currentCount + 1)
                        .build();
                paperQuestionRepository.save(pq);
            }
        }

        return toDto(question, true);
    }

    @Transactional
    public QuestionDto updateQuestion(UUID questionId, QuestionUpdateRequest request, UUID teacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        if (!question.getCreatedBy().getId().equals(teacherId)) {
            throw new BusinessException("You can only edit your own questions", HttpStatus.FORBIDDEN);
        }

        if (question.getStatus() == QuestionStatus.APPROVED) {
            throw new BusinessException("Cannot edit an approved question. Create a new version instead.");
        }

        validateOptions(request.options());

        question.setQuestionText(request.questionText());
        question.clearOptions();
        questionRepository.saveAndFlush(question);

        for (QuestionOptionRequest optReq : request.options()) {
            QuestionOption option = QuestionOption.builder()
                    .optionText(optReq.optionText())
                    .isCorrect(optReq.isCorrect())
                    .optionOrder(optReq.optionOrder())
                    .build();
            question.addOption(option);
        }

        // Reset to DRAFT if was rejected
        if (question.getStatus() == QuestionStatus.REJECTED) {
            question.setStatus(QuestionStatus.DRAFT);
            question.setRejectionReason(null);
        }

        question = questionRepository.save(question);
        return toDto(question, true);
    }

    @Transactional
    public QuestionDto submitForReview(UUID questionId, UUID teacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        if (!question.getCreatedBy().getId().equals(teacherId)) {
            throw new BusinessException("You can only submit your own questions", HttpStatus.FORBIDDEN);
        }

        User teacher = question.getCreatedBy();
        if (!teacher.isTeacherVerified()) {
            throw new BusinessException("Teacher must be verified before submitting questions", HttpStatus.FORBIDDEN);
        }

        if (question.getStatus() != QuestionStatus.DRAFT && question.getStatus() != QuestionStatus.REJECTED) {
            throw new BusinessException("Only DRAFT or REJECTED questions can be submitted for review");
        }

        if (question.getOptions().size() != 4) {
            throw new BusinessException("Question must have exactly 4 options before submission");
        }

        long correctCount = question.getOptions().stream().filter(QuestionOption::isCorrect).count();
        if (correctCount != 1) {
            throw new BusinessException("Question must have exactly 1 correct option before submission");
        }

        question.setStatus(QuestionStatus.PENDING_REVIEW);
        question.setRejectionReason(null);
        question = questionRepository.save(question);
        return toDto(question, true);
    }

    @Transactional(readOnly = true)
    public PagedResponse<QuestionDto> getTeacherQuestions(UUID teacherId, int page, int size) {
        PageRequest pageRequest = PaginationUtil.of(page, size, Sort.by("createdAt").descending());
        Page<Question> questionPage = questionRepository.findByCreatedById(teacherId, pageRequest);
        return buildPagedResponse(questionPage, true);
    }

    @Transactional(readOnly = true)
    public QuestionDto getTeacherQuestionById(UUID questionId, UUID teacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        if (!question.getCreatedBy().getId().equals(teacherId)) {
            throw new BusinessException("You can only view your own questions", HttpStatus.FORBIDDEN);
        }

        return toDto(question, true);
    }

    // ==================== Admin Operations ====================

    @Transactional
    public QuestionDto assignPaperToQuestion(UUID questionId, UUID paperId, UUID teacherId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        if (!question.getCreatedBy().getId().equals(teacherId)) {
            throw new BusinessException("You can only modify your own questions", HttpStatus.FORBIDDEN);
        }

        if (question.getStatus() == QuestionStatus.APPROVED || question.getStatus() == QuestionStatus.PENDING_REVIEW) {
            throw new BusinessException("Cannot change paper assignment for " + question.getStatus() + " questions");
        }

        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        if (!subjectService.isTeacherAssignedToSubject(teacherId, paper.getSubject().getId())) {
            throw new BusinessException("Teacher is not assigned to this subject", HttpStatus.FORBIDDEN);
        }

        question.setPaper(paper);
        question.setSubject(paper.getSubject());
        question.setYear(paper.getYear());
        question = questionRepository.save(question);
        return toDto(question, true);
    }

    @Transactional(readOnly = true)
    public PagedResponse<QuestionDto> getPendingQuestions(int page, int size) {
        PageRequest pageRequest = PaginationUtil.of(page, size, Sort.by("createdAt").ascending());
        Page<Question> questionPage = questionRepository.findByStatus(QuestionStatus.PENDING_REVIEW, pageRequest);
        return buildPagedResponse(questionPage, true);
    }

    @Transactional
    public QuestionDto approveQuestion(UUID questionId, UUID adminId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        if (question.getStatus() != QuestionStatus.PENDING_REVIEW) {
            throw new BusinessException("Only PENDING_REVIEW questions can be approved");
        }

        // DB trigger will also validate, but we check here for a better error message
        if (question.getOptions().size() != 4) {
            throw new BusinessException("Question must have exactly 4 options to be approved");
        }

        long correctCount = question.getOptions().stream().filter(QuestionOption::isCorrect).count();
        if (correctCount != 1) {
            throw new BusinessException("Question must have exactly 1 correct option to be approved");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "id", adminId));

        question.setStatus(QuestionStatus.APPROVED);
        question.setApprovedBy(admin);
        question.setApprovedAt(LocalDateTime.now());
        question.setRejectionReason(null);
        question = questionRepository.save(question);

        // Auto-assign to paper if question has a paper reference
        if (question.getPaper() != null) {
            UUID paperId = question.getPaper().getId();
            if (!paperQuestionRepository.existsByPaperIdAndQuestionId(paperId, question.getId())) {
                long currentCount = paperQuestionRepository.countByPaperId(paperId);
                if (currentCount < question.getPaper().getQuestionCount()) {
                    int nextPosition = (int) currentCount + 1;
                    PaperQuestion pq = PaperQuestion.builder()
                            .paper(question.getPaper())
                            .question(question)
                            .position(nextPosition)
                            .build();
                    paperQuestionRepository.save(pq);
                }
            }
        }

        return toDto(question, true);
    }

    @Transactional
    public QuestionDto rejectQuestion(UUID questionId, String reason, UUID adminId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        if (question.getStatus() != QuestionStatus.PENDING_REVIEW) {
            throw new BusinessException("Only PENDING_REVIEW questions can be rejected");
        }

        question.setStatus(QuestionStatus.REJECTED);
        question.setRejectionReason(reason);
        question = questionRepository.save(question);
        return toDto(question, true);
    }

    // ==================== Super Admin Operations ====================

    @Transactional(readOnly = true)
    public PagedResponse<QuestionDto> getAllQuestionsForSuperAdmin(int page, int size, String status) {
        PageRequest pageRequest = PaginationUtil.of(page, size, Sort.by("createdAt").descending());
        Page<Question> questionPage;
        if (status != null && !status.isBlank()) {
            QuestionStatus questionStatus = QuestionStatus.valueOf(status.toUpperCase());
            questionPage = questionRepository.findByStatus(questionStatus, pageRequest);
        } else {
            questionPage = questionRepository.findAll(pageRequest);
        }
        return buildPagedResponse(questionPage, true);
    }

    @Transactional
    public QuestionDto superAdminCreateQuestion(QuestionCreateRequest request, UUID superAdminId) {
        User superAdmin = userRepository.findById(superAdminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", superAdminId));

        Paper paper = null;
        Subject subject;
        int year;

        if (request.paperId() != null) {
            paper = paperRepository.findById(request.paperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", request.paperId()));
            subject = paper.getSubject();
            year = paper.getYear();
        } else {
            if (request.subjectId() == null || request.year() == null) {
                throw new BusinessException("Either paperId or both subjectId and year are required");
            }
            subject = subjectRepository.findById(request.subjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.subjectId()));
            year = request.year();
            // Try to find existing paper for subject+year
            paper = paperRepository.findByYearAndSubjectId(year, subject.getId()).orElse(null);
        }

        validateOptions(request.options());

        Question question = Question.builder()
                .subject(subject)
                .createdBy(superAdmin)
                .questionText(request.questionText())
                .year(year)
                .paper(paper)
                .status(QuestionStatus.APPROVED)
                .approvedBy(superAdmin)
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
        return toDto(question, true);
    }

    @Transactional
    public QuestionDto superAdminUpdateQuestion(UUID questionId, QuestionUpdateRequest request, UUID superAdminId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        validateOptions(request.options());

        question.setQuestionText(request.questionText());
        question.clearOptions();
        questionRepository.saveAndFlush(question);

        for (QuestionOptionRequest optReq : request.options()) {
            QuestionOption option = QuestionOption.builder()
                    .optionText(optReq.optionText())
                    .isCorrect(optReq.isCorrect())
                    .optionOrder(optReq.optionOrder())
                    .build();
            question.addOption(option);
        }

        question = questionRepository.save(question);
        return toDto(question, true);
    }

    @Transactional
    public void superAdminDeleteQuestion(UUID questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));
        questionRepository.delete(question);
    }

    // ==================== Helpers ====================

    private void validateOptions(List<QuestionOptionRequest> options) {
        if (options.size() != 4) {
            throw new BusinessException("Exactly 4 options are required");
        }

        long correctCount = options.stream().filter(QuestionOptionRequest::isCorrect).count();
        if (correctCount != 1) {
            throw new BusinessException("Exactly 1 option must be marked as correct (found " + correctCount + ")");
        }

        // Validate unique order values 1-4
        var orders = options.stream().map(QuestionOptionRequest::optionOrder).sorted().toList();
        if (!orders.equals(List.of(1, 2, 3, 4))) {
            throw new BusinessException("Options must have unique order values 1, 2, 3, 4");
        }
    }

    public QuestionDto toDto(Question question, boolean includeCorrectAnswer) {
        List<QuestionOptionDto> optionDtos = question.getOptions().stream()
                .map(o -> new QuestionOptionDto(
                        o.getId(),
                        o.getOptionText(),
                        o.getOptionOrder(),
                        includeCorrectAnswer ? o.isCorrect() : null))
                .toList();

        return new QuestionDto(
                question.getId(),
                question.getSubject().getId(),
                question.getSubject().getName(),
                question.getYear(),
                question.getPaper() != null ? question.getPaper().getId() : null,
                question.getQuestionText(),
                question.getStatus().name(),
                question.getRejectionReason(),
                question.getApprovedBy() != null ? question.getApprovedBy().getEmail() : null,
                question.getApprovedAt(),
                question.getVersion(),
                optionDtos,
                question.getCreatedBy().getEmail(),
                question.getCreatedAt(),
                question.getUpdatedAt());
    }

    private PagedResponse<QuestionDto> buildPagedResponse(Page<Question> page, boolean includeCorrectAnswer) {
        List<QuestionDto> content = page.getContent().stream()
                .map(q -> toDto(q, includeCorrectAnswer))
                .toList();

        return PagedResponse.<QuestionDto>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
