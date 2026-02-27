package com.piriven.mcq.attempt.entity;

import com.piriven.mcq.paper.entity.PaperQuestion;
import com.piriven.mcq.question.entity.Question;
import com.piriven.mcq.question.entity.QuestionOption;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attempt_answers", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "attempt_id", "paper_question_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private Attempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paper_question_id", nullable = false)
    private PaperQuestion paperQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private QuestionOption selectedOption;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "served_at", nullable = false)
    private LocalDateTime servedAt;

    @Column(name = "question_deadline", nullable = false)
    private LocalDateTime questionDeadline;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;

    @Column(name = "is_timeout", nullable = false)
    private boolean isTimeout;
}
