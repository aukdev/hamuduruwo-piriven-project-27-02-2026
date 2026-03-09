package com.piriven.mcq.attempt.repository;

import com.piriven.mcq.attempt.entity.Attempt;
import com.piriven.mcq.attempt.entity.AttemptStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, UUID> {

        long countByStudentIdAndPaperId(UUID studentId, UUID paperId);

        List<Attempt> findByStudentIdAndPaperIdOrderByAttemptNo(UUID studentId, UUID paperId);

        Optional<Attempt> findByStudentIdAndStatus(UUID studentId, AttemptStatus status);

        @Query("SELECT MAX(a.score) FROM Attempt a WHERE a.student.id = :studentId AND a.paper.id = :paperId AND a.status IN ('SUBMITTED', 'EXPIRED')")
        Optional<Integer> findBestScoreByStudentAndPaper(@Param("studentId") UUID studentId,
                        @Param("paperId") UUID paperId);

        @Query("SELECT a FROM Attempt a WHERE a.student.id = :studentId AND a.paper.id = :paperId AND a.status IN ('SUBMITTED', 'EXPIRED') ORDER BY a.score DESC")
        List<Attempt> findCompletedAttemptsByStudentAndPaper(@Param("studentId") UUID studentId,
                        @Param("paperId") UUID paperId);

        @Query(value = "SELECT a FROM Attempt a JOIN FETCH a.student JOIN FETCH a.paper p JOIN FETCH p.subject " +
                        "WHERE a.status IN ('SUBMITTED', 'EXPIRED') " +
                        "ORDER BY a.submittedAt DESC", countQuery = "SELECT COUNT(a) FROM Attempt a WHERE a.status IN ('SUBMITTED', 'EXPIRED')")
        Page<Attempt> findAllCompletedAttempts(Pageable pageable);

        @Query(value = "SELECT a FROM Attempt a JOIN FETCH a.student JOIN FETCH a.paper p JOIN FETCH p.subject " +
                        "WHERE a.paper.id = :paperId AND a.status IN ('SUBMITTED', 'EXPIRED') " +
                        "ORDER BY a.submittedAt DESC", countQuery = "SELECT COUNT(a) FROM Attempt a WHERE a.paper.id = :paperId AND a.status IN ('SUBMITTED', 'EXPIRED')")
        Page<Attempt> findCompletedAttemptsByPaperId(@Param("paperId") UUID paperId, Pageable pageable);

        @Query(value = "SELECT a FROM Attempt a JOIN FETCH a.student JOIN FETCH a.paper p JOIN FETCH p.subject " +
                        "WHERE a.student.id = :studentId AND a.status IN ('SUBMITTED', 'EXPIRED') " +
                        "ORDER BY a.submittedAt DESC", countQuery = "SELECT COUNT(a) FROM Attempt a WHERE a.student.id = :studentId AND a.status IN ('SUBMITTED', 'EXPIRED')")
        Page<Attempt> findCompletedAttemptsByStudentId(@Param("studentId") UUID studentId, Pageable pageable);
}
