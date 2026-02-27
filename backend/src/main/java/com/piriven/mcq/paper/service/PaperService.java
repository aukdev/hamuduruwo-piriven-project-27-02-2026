package com.piriven.mcq.paper.service;

import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.paper.dto.PaperDetailDto;
import com.piriven.mcq.paper.dto.PaperDto;
import com.piriven.mcq.paper.dto.PaperQuestionAssignRequest;
import com.piriven.mcq.paper.entity.Paper;
import com.piriven.mcq.paper.entity.PaperQuestion;
import com.piriven.mcq.paper.repository.PaperQuestionRepository;
import com.piriven.mcq.paper.repository.PaperRepository;
import com.piriven.mcq.question.entity.Question;
import com.piriven.mcq.question.entity.QuestionStatus;
import com.piriven.mcq.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaperService {

    private final PaperRepository paperRepository;
    private final PaperQuestionRepository paperQuestionRepository;
    private final QuestionRepository questionRepository;

    @Transactional(readOnly = true)
    public List<Integer> getAvailableYears() {
        return paperRepository.findDistinctYears();
    }

    @Transactional(readOnly = true)
    public List<PaperDto> getPapersByYear(int year) {
        List<Paper> papers = paperRepository.findByYearOrderByPaperNo(year);
        return papers.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public PaperDetailDto getPaperDetail(UUID paperId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        List<PaperQuestion> pqs = paperQuestionRepository.findByPaperIdOrderByPosition(paperId);

        List<PaperDetailDto.PaperQuestionInfo> questions = pqs.stream()
                .map(pq -> new PaperDetailDto.PaperQuestionInfo(
                        pq.getPosition(),
                        pq.getQuestion().getId(),
                        pq.getQuestion().getQuestionText(),
                        pq.getQuestion().getSubject().getName()))
                .toList();

        return new PaperDetailDto(
                paper.getId(),
                paper.getYear(),
                paper.getPaperNo(),
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
        if (currentCount >= 40) {
            throw new BusinessException("Paper already has 40 questions assigned", HttpStatus.CONFLICT);
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

    private PaperDto toDto(Paper paper) {
        long assigned = paperQuestionRepository.countByPaperId(paper.getId());
        return new PaperDto(
                paper.getId(),
                paper.getYear(),
                paper.getPaperNo(),
                paper.getDurationSeconds(),
                paper.getQuestionCount(),
                assigned);
    }
}
