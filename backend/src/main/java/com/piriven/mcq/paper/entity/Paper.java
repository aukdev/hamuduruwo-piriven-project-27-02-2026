package com.piriven.mcq.paper.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "papers", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "year", "paper_no" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private int year;

    @Column(name = "paper_no", nullable = false)
    private int paperNo;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(name = "question_count", nullable = false)
    private int questionCount;

    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("position ASC")
    @Builder.Default
    private List<PaperQuestion> paperQuestions = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (durationSeconds == 0)
            durationSeconds = 1200;
        if (questionCount == 0)
            questionCount = 40;
    }
}
