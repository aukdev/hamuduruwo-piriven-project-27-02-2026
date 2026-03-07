package com.piriven.mcq.paper.service;

import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.paper.dto.*;
import com.piriven.mcq.paper.entity.Paper;
import com.piriven.mcq.paper.entity.PaperQuestion;
import com.piriven.mcq.paper.repository.PaperQuestionRepository;
import com.piriven.mcq.paper.repository.PaperRepository;
import com.piriven.mcq.question.dto.QuestionOptionRequest;
import com.piriven.mcq.question.entity.Question;
import com.piriven.mcq.question.entity.QuestionOption;
import com.piriven.mcq.question.entity.QuestionStatus;
import com.piriven.mcq.question.repository.QuestionRepository;
import com.piriven.mcq.subject.entity.Subject;
import com.piriven.mcq.subject.repository.SubjectRepository;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Transactional(readOnly = true)
    public List<Integer> getAvailableYears() {
        return paperRepository.findDistinctYears();
    }

    @Transactional(readOnly = true)
    public List<PaperDto> getPapersByYear(int year) {
        List<Paper> papers = paperRepository.findByYearWithSubject(year);
        return papers.stream().map(this::toDto).toList();
    }

    @Transactional
    public PaperDto createPaper(PaperCreateRequest request) {
        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.subjectId()));

        if (paperRepository.existsByYearAndSubjectId(request.year(), request.subjectId())) {
            throw new BusinessException(
                    "Paper already exists for year " + request.year() + " and subject '" + subject.getName() + "'",
                    HttpStatus.CONFLICT);
        }

        Paper paper = Paper.builder()
                .year(request.year())
                .subject(subject)
                .durationSeconds(request.durationSeconds() > 0 ? request.durationSeconds() : 1200)
                .questionCount(request.questionCount())
                .build();

        paper = paperRepository.save(paper);
        return toDto(paper);
    }

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

        // Validate options
        validateOptions(request.options());

        // Create question with paper's subject, auto-approved
        Question question = Question.builder()
                .subject(paper.getSubject())
                .createdBy(creator)
                .questionText(request.questionText())
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

        // Auto-assign to next available position
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
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        PaperQuestion pq = paperQuestionRepository.findByPaperIdAndQuestionId(paperId, questionId)
                .orElseThrow(() -> new BusinessException("Question is not assigned to this paper"));

        paperQuestionRepository.delete(pq);

        // Reorder remaining positions
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

    private PaperDto toDto(Paper paper) {
        long assigned = paperQuestionRepository.countByPaperId(paper.getId());
        return new PaperDto(
                paper.getId(),
                paper.getYear(),
                paper.getSubject().getId(),
                paper.getSubject().getName(),
                paper.getDurationSeconds(),
                paper.getQuestionCount(),
                assigned);
    }
}
