package com.piriven.mcq.question.repository;

import com.piriven.mcq.question.entity.Question;
import com.piriven.mcq.question.entity.QuestionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {

    Page<Question> findByStatus(QuestionStatus status, Pageable pageable);

    List<Question> findByCreatedByIdAndStatus(UUID createdById, QuestionStatus status);

    Page<Question> findByCreatedById(UUID createdById, Pageable pageable);

    long countBySubjectIdAndStatus(UUID subjectId, QuestionStatus status);
}
