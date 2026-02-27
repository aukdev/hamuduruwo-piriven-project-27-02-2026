package com.piriven.mcq.attempt.service;

import com.piriven.mcq.attempt.dto.*;
import com.piriven.mcq.attempt.entity.Attempt;
import com.piriven.mcq.attempt.entity.AttemptAnswer;
import com.piriven.mcq.attempt.entity.AttemptStatus;
import com.piriven.mcq.attempt.repository.AttemptAnswerRepository;
import com.piriven.mcq.attempt.repository.AttemptRepository;
import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.paper.entity.Paper;
import com.piriven.mcq.paper.entity.PaperQuestion;
import com.piriven.mcq.paper.repository.PaperQuestionRepository;
import com.piriven.mcq.paper.repository.PaperRepository;
import com.piriven.mcq.question.dto.QuestionOptionDto;
import com.piriven.mcq.question.entity.Question;
import com.piriven.mcq.question.entity.QuestionOption;
import com.piriven.mcq.question.repository.QuestionOptionRepository;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final PaperRepository paperRepository;
    private final PaperQuestionRepository paperQuestionRepository;
    private final UserRepository userRepository;
    private final QuestionOptionRepository questionOptionRepository;

    @Value("${app.exam.total-duration-seconds:1200}")
    private int totalDurationSeconds;

    @Value("${app.exam.per-question-seconds:30}")
    private int perQuestionSeconds;

    @Value("${app.exam.max-attempts-per-paper:10}")
    private int maxAttemptsPerPaper;

    @Value("${app.exam.questions-per-paper:40}")
    private int questionsPerPaper;

    // ==================== Start Attempt ====================

    @Transactional
    public AttemptStartResponse startAttempt(UUID paperId, UUID studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new ResourceNotFoundException("Paper", "id", paperId));

        // Check paper has 40 questions
        long assignedCount = paperQuestionRepository.countByPaperId(paperId);
        if (assignedCount < questionsPerPaper) {
            throw new BusinessException("Paper does not have " + questionsPerPaper +
                    " questions assigned yet. Currently has " + assignedCount);
        }

        // Check if student has an in-progress attempt (can only have one at a time)
        Optional<Attempt> inProgress = attemptRepository.findByStudentIdAndStatus(
                studentId, AttemptStatus.IN_PROGRESS);
        if (inProgress.isPresent()) {
            Attempt existing = inProgress.get();
            // Check if expired
            if (LocalDateTime.now().isAfter(existing.getExpiresAt())) {
                expireAttempt(existing);
            } else {
                throw new BusinessException("You already have an in-progress attempt (ID: " +
                        existing.getId() + "). Complete or wait for it to expire before starting a new one.");
            }
        }

        // Enforce max 10 attempts per (student, paper)
        long attemptCount = attemptRepository.countByStudentIdAndPaperId(studentId, paperId);
        if (attemptCount >= maxAttemptsPerPaper) {
            throw new BusinessException("Maximum " + maxAttemptsPerPaper +
                    " attempts reached for this paper", HttpStatus.FORBIDDEN);
        }

        int attemptNo = (int) attemptCount + 1;
        LocalDateTime now = LocalDateTime.now();

        Attempt attempt = Attempt.builder()
                .student(student)
                .paper(paper)
                .attemptNo(attemptNo)
                .status(AttemptStatus.IN_PROGRESS)
                .startedAt(now)
                .expiresAt(now.plusSeconds(totalDurationSeconds))
                .correctCount(0)
                .wrongCount(0)
                .score(0)
                .build();

        attempt = attemptRepository.save(attempt);

        return new AttemptStartResponse(
                attempt.getId(),
                attemptNo,
                paper.getYear(),
                paper.getPaperNo(),
                paper.getQuestionCount(),
                paper.getDurationSeconds(),
                attempt.getStartedAt(),
                attempt.getExpiresAt());
    }

    // ==================== Get Next Question ====================

    @Transactional
    public NextQuestionResponse getNextQuestion(UUID attemptId, UUID studentId) {
        Attempt attempt = getAttemptForStudent(attemptId, studentId);

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BusinessException("Attempt is not in progress (status: " + attempt.getStatus() + ")");
        }

        LocalDateTime now = LocalDateTime.now();

        // Check total attempt expiry
        if (now.isAfter(attempt.getExpiresAt())) {
            expireAttempt(attempt);
            return NextQuestionResponse.expired(attemptId);
        }

        // Check for currently served but unanswered question
        Optional<AttemptAnswer> currentServed = attemptAnswerRepository
                .findByAttemptIdAndAnsweredAtIsNullAndIsTimeoutFalse(attemptId);

        if (currentServed.isPresent()) {
            AttemptAnswer aa = currentServed.get();
            if (now.isAfter(aa.getQuestionDeadline())) {
                // Question timed out — mark as timeout and move on
                aa.setTimeout(true);
                aa.setIsCorrect(false);
                aa.setAnsweredAt(now);
                aa.setTimeTakenSeconds(perQuestionSeconds);
                attemptAnswerRepository.save(aa);
            } else {
                // Still within time for this question — return same question
                return buildQuestionResponse(attempt, aa);
            }
        }

        // Find all paper questions ordered by position
        List<PaperQuestion> paperQuestions = paperQuestionRepository
                .findByPaperIdOrderByPosition(attempt.getPaper().getId());

        // Find which paper questions have already been answered/timed-out
        Set<UUID> answeredPqIds = attemptAnswerRepository.findByAttemptId(attemptId).stream()
                .filter(a -> a.getAnsweredAt() != null || a.isTimeout())
                .map(a -> a.getPaperQuestion().getId())
                .collect(Collectors.toSet());

        // Also include currently served (shouldn't happen here since we handled it
        // above,
        // but for safety include all existing attempt answers)
        Set<UUID> allServedPqIds = attemptAnswerRepository.findByAttemptId(attemptId).stream()
                .map(a -> a.getPaperQuestion().getId())
                .collect(Collectors.toSet());

        // Find next unanswered position
        PaperQuestion nextPQ = paperQuestions.stream()
                .filter(pq -> !allServedPqIds.contains(pq.getId()))
                .findFirst()
                .orElse(null);

        if (nextPQ == null) {
            // All questions have been served and answered/timed-out
            return NextQuestionResponse.allAnswered();
        }

        // Create placeholder AttemptAnswer
        AttemptAnswer answer = AttemptAnswer.builder()
                .attempt(attempt)
                .paperQuestion(nextPQ)
                .question(nextPQ.getQuestion())
                .servedAt(now)
                .questionDeadline(now.plusSeconds(perQuestionSeconds))
                .isTimeout(false)
                .build();

        answer = attemptAnswerRepository.save(answer);

        return buildQuestionResponse(attempt, answer);
    }

    // ==================== Submit Answer ====================

    @Transactional
    public AnswerResponse submitAnswer(UUID attemptId, AnswerRequest request, UUID studentId) {
        Attempt attempt = getAttemptForStudent(attemptId, studentId);

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BusinessException("Attempt is not in progress");
        }

        LocalDateTime now = LocalDateTime.now();

        // Check total attempt expiry
        if (now.isAfter(attempt.getExpiresAt())) {
            expireAttempt(attempt);
            return new AnswerResponse(false, false, true,
                    "Attempt has expired. Your attempt has been marked as EXPIRED.");
        }

        // Find the currently served unanswered question
        AttemptAnswer currentAnswer = attemptAnswerRepository
                .findByAttemptIdAndAnsweredAtIsNullAndIsTimeoutFalse(attemptId)
                .orElseThrow(() -> new BusinessException(
                        "No pending question found. Call next-question first."));

        // Validate that the submitted question matches the currently served one
        if (!currentAnswer.getQuestion().getId().equals(request.questionId())) {
            throw new BusinessException("Answer must be for the currently served question. " +
                    "Expected question: " + currentAnswer.getQuestion().getId());
        }

        // Check per-question deadline
        if (now.isAfter(currentAnswer.getQuestionDeadline())) {
            // Question timed out
            currentAnswer.setTimeout(true);
            currentAnswer.setIsCorrect(false);
            currentAnswer.setAnsweredAt(now);
            currentAnswer.setTimeTakenSeconds(perQuestionSeconds);
            attemptAnswerRepository.save(currentAnswer);

            return new AnswerResponse(true, true, false,
                    "Time expired for this question. Marked as unanswered.");
        }

        // Validate the selected option belongs to this question
        QuestionOption selectedOption = questionOptionRepository.findById(request.selectedOptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Option", "id", request.selectedOptionId()));

        if (!selectedOption.getQuestion().getId().equals(request.questionId())) {
            throw new BusinessException("Selected option does not belong to this question");
        }

        // Record the answer
        currentAnswer.setSelectedOption(selectedOption);
        currentAnswer.setIsCorrect(selectedOption.isCorrect());
        currentAnswer.setAnsweredAt(now);
        currentAnswer.setTimeout(false);

        long timeTaken = Duration.between(currentAnswer.getServedAt(), now).getSeconds();
        currentAnswer.setTimeTakenSeconds((int) timeTaken);

        attemptAnswerRepository.save(currentAnswer);

        String msg = selectedOption.isCorrect() ? "Correct answer!" : "Answer recorded.";
        return new AnswerResponse(true, false, false, msg);
    }

    // ==================== Submit Attempt ====================

    @Transactional
    public AttemptResultResponse submitAttempt(UUID attemptId, UUID studentId) {
        Attempt attempt = getAttemptForStudent(attemptId, studentId);

        if (attempt.getStatus() == AttemptStatus.SUBMITTED) {
            // Already submitted - just return the result
            return computeResult(attempt);
        }

        if (attempt.getStatus() == AttemptStatus.EXPIRED) {
            return computeResult(attempt);
        }

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BusinessException("Attempt cannot be submitted (status: " + attempt.getStatus() + ")");
        }

        // Mark any currently served but unanswered questions as timeout
        Optional<AttemptAnswer> pending = attemptAnswerRepository
                .findByAttemptIdAndAnsweredAtIsNullAndIsTimeoutFalse(attemptId);
        if (pending.isPresent()) {
            AttemptAnswer aa = pending.get();
            aa.setTimeout(true);
            aa.setIsCorrect(false);
            aa.setAnsweredAt(LocalDateTime.now());
            attemptAnswerRepository.save(aa);
        }

        // Compute scores
        computeAndSaveScore(attempt);

        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setSubmittedAt(LocalDateTime.now());
        attemptRepository.save(attempt);

        return computeResult(attempt);
    }

    // ==================== Get Result ====================

    @Transactional(readOnly = true)
    public AttemptResultResponse getResult(UUID attemptId, UUID studentId) {
        Attempt attempt = getAttemptForStudent(attemptId, studentId);

        if (attempt.getStatus() == AttemptStatus.IN_PROGRESS) {
            throw new BusinessException("Attempt is still in progress. Submit it first.");
        }

        return computeResult(attempt);
    }

    // ==================== Helper Methods ====================

    private Attempt getAttemptForStudent(UUID attemptId, UUID studentId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt", "id", attemptId));

        if (!attempt.getStudent().getId().equals(studentId)) {
            throw new BusinessException("This attempt does not belong to you", HttpStatus.FORBIDDEN);
        }

        return attempt;
    }

    private void expireAttempt(Attempt attempt) {
        // Mark all unanswered questions as timeout
        List<AttemptAnswer> allAnswers = attemptAnswerRepository.findByAttemptId(attempt.getId());
        for (AttemptAnswer aa : allAnswers) {
            if (aa.getAnsweredAt() == null && !aa.isTimeout()) {
                aa.setTimeout(true);
                aa.setIsCorrect(false);
                aa.setAnsweredAt(LocalDateTime.now());
                attemptAnswerRepository.save(aa);
            }
        }

        computeAndSaveScore(attempt);
        attempt.setStatus(AttemptStatus.EXPIRED);
        attempt.setSubmittedAt(LocalDateTime.now());
        attemptRepository.save(attempt);
    }

    private void computeAndSaveScore(Attempt attempt) {
        List<AttemptAnswer> answers = attemptAnswerRepository.findByAttemptId(attempt.getId());

        int correctCount = 0;
        int wrongCount = 0;

        for (AttemptAnswer aa : answers) {
            if (Boolean.TRUE.equals(aa.getIsCorrect())) {
                correctCount++;
            } else if (aa.getAnsweredAt() != null || aa.isTimeout()) {
                wrongCount++;
            }
        }

        // Unanswered questions (never served) also count as wrong
        int totalAnswered = correctCount + wrongCount;
        int unanswered = questionsPerPaper - totalAnswered;
        wrongCount += unanswered;

        attempt.setCorrectCount(correctCount);
        attempt.setWrongCount(wrongCount);
        attempt.setScore(correctCount); // 1 mark per correct question
        attemptRepository.save(attempt);
    }

    private AttemptResultResponse computeResult(Attempt attempt) {
        int correctCount = attempt.getCorrectCount();
        int wrongCount = attempt.getWrongCount();
        int score = attempt.getScore();
        int unanswered = questionsPerPaper - correctCount - wrongCount;
        if (unanswered < 0)
            unanswered = 0;

        // Generate Sinhala score message
        String scoreMessage = generateScoreMessage(score);

        // Compare with previous best
        UUID paperId = attempt.getPaper().getId();
        UUID studentId = attempt.getStudent().getId();

        Optional<Integer> previousBest = attemptRepository
                .findBestScoreByStudentAndPaper(studentId, paperId);

        // The previous best should exclude the current attempt
        Integer prevBestScore = null;
        boolean isNewBest = false;
        String comparisonMessage = null;

        List<Attempt> completedAttempts = attemptRepository
                .findCompletedAttemptsByStudentAndPaper(studentId, paperId);

        // Find best score from OTHER completed attempts (not this one)
        OptionalInt otherBest = completedAttempts.stream()
                .filter(a -> !a.getId().equals(attempt.getId()))
                .mapToInt(Attempt::getScore)
                .max();

        if (otherBest.isPresent()) {
            prevBestScore = otherBest.getAsInt();
            if (score > prevBestScore) {
                isNewBest = true;
                comparisonMessage = "සුබ පැතුම්! ඔබේ පෙර හොඳම ලකුණු වාර්තාව (" +
                        prevBestScore + "/40) ඉක්මවා ඇත! නව හොඳම ලකුණු: " +
                        score + "/40 🎉";
            } else {
                comparisonMessage = "ඔබට තවත් වැඩි දියුණු විය හැකිය. ඔබේ හොඳම ලකුණු: " +
                        prevBestScore + "/40. නැවත උත්සාහ කරන්න! 💪";
            }
        }

        return new AttemptResultResponse(
                attempt.getId(),
                attempt.getAttemptNo(),
                attempt.getStatus().name(),
                attempt.getPaper().getYear(),
                attempt.getPaper().getPaperNo(),
                correctCount,
                wrongCount,
                unanswered,
                score,
                questionsPerPaper,
                attempt.getStartedAt(),
                attempt.getSubmittedAt(),
                scoreMessage,
                prevBestScore,
                isNewBest,
                comparisonMessage);
    }

    private String generateScoreMessage(int score) {
        if (score > 35) {
            return "ඉතා විශිෂ්ටයි! ඔබ ඉතා දක්ෂ ශිෂ්‍යයෙකි. " +
                    "මෙම විශිෂ්ට ප්‍රතිඵලය ගැන අපි ඔබට සුබ පතමු! " +
                    "ඔබේ කැපවීම හා උත්සාහය ඉතා ප්‍රශංසනීයයි. " +
                    "මෙලෙස දිගටම ඉදිරියට යන්න! 🌟";
        } else if (score >= 30) {
            return "හොඳයි! ඔබ හොඳ ප්‍රතිඵලයක් ලබා ඇත. " +
                    "තව උනන්දු වී පාඩම් කළ යුතුයි. " +
                    "ඔබට තවත් ඉහළ ප්‍රතිඵල ලබා ගත හැකිය! 📚";
        } else {
            return "අධෛර්ය නොවන්න! තව මහන්සි වී පාඩම් කළ යුතුයි. " +
                    "ඔබට හැකියාව ඇත. නැවත නැවත උත්සාහ කරන්න. " +
                    "සෑම උත්සාහයකම ඔබ දියුණු වේ! 💪";
        }
    }

    private NextQuestionResponse buildQuestionResponse(Attempt attempt, AttemptAnswer answer) {
        Question question = answer.getQuestion();
        LocalDateTime now = LocalDateTime.now();

        long remainTotal = Math.max(0, Duration.between(now, attempt.getExpiresAt()).getSeconds());
        long remainQuestion = Math.max(0, Duration.between(now, answer.getQuestionDeadline()).getSeconds());

        // Load options without isCorrect
        List<QuestionOptionDto> optionDtos = question.getOptions().stream()
                .map(o -> new QuestionOptionDto(o.getId(), o.getOptionText(), o.getOptionOrder(), null))
                .toList();

        return new NextQuestionResponse(
                false,
                false,
                answer.getPaperQuestion().getPosition(),
                question.getId(),
                question.getQuestionText(),
                optionDtos,
                remainTotal,
                remainQuestion,
                null);
    }
}
