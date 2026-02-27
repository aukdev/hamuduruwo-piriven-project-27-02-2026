package com.piriven.mcq.paper.repository;

import com.piriven.mcq.paper.entity.PaperQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaperQuestionRepository extends JpaRepository<PaperQuestion, UUID> {

    List<PaperQuestion> findByPaperIdOrderByPosition(UUID paperId);

    long countByPaperId(UUID paperId);

    boolean existsByPaperIdAndPosition(UUID paperId, int position);

    boolean existsByPaperIdAndQuestionId(UUID paperId, UUID questionId);
}
