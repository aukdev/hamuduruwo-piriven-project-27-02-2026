package com.piriven.mcq.paper.repository;

import com.piriven.mcq.paper.entity.Paper;
import com.piriven.mcq.paper.entity.PaperStatus;
import com.piriven.mcq.paper.entity.PaperType;
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
public interface PaperRepository extends JpaRepository<Paper, UUID> {

    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.year = :year AND p.paperType = :paperType ORDER BY p.subject.name")
    List<Paper> findByYearAndPaperTypeWithSubject(@Param("year") int year, @Param("paperType") PaperType paperType);

    Optional<Paper> findByYearAndSubjectId(int year, UUID subjectId);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Paper p WHERE p.year = :year AND p.subject.id = :subjectId AND p.paperType = :paperType")
    boolean existsByYearAndSubjectIdAndPaperType(@Param("year") int year, @Param("subjectId") UUID subjectId,
            @Param("paperType") PaperType paperType);

    boolean existsByYearAndSubjectId(int year, UUID subjectId);

    @Query("SELECT DISTINCT p.year FROM Paper p WHERE p.paperType = :paperType ORDER BY p.year")
    List<Integer> findDistinctYearsByPaperType(@Param("paperType") PaperType paperType);

    @Query("SELECT DISTINCT p.year FROM Paper p ORDER BY p.year")
    List<Integer> findDistinctYears();

    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.subject.id IN :subjectIds AND p.paperType = :paperType ORDER BY p.year DESC, p.subject.name")
    List<Paper> findBySubjectIdInAndPaperType(@Param("subjectIds") List<UUID> subjectIds,
            @Param("paperType") PaperType paperType);

    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.subject.id IN :subjectIds ORDER BY p.year DESC, p.subject.name")
    List<Paper> findBySubjectIdIn(@Param("subjectIds") List<UUID> subjectIds);

    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.subject.id = :subjectId ORDER BY p.year DESC")
    List<Paper> findBySubjectIdWithSubject(@Param("subjectId") UUID subjectId);

    // Practice paper queries
    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.paperType = :paperType AND p.status = :status ORDER BY p.createdAt DESC")
    Page<Paper> findByPaperTypeAndStatus(@Param("paperType") PaperType paperType, @Param("status") PaperStatus status,
            Pageable pageable);

    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.createdBy.id = :createdById AND p.paperType = :paperType ORDER BY p.createdAt DESC")
    Page<Paper> findByCreatedByIdAndPaperType(@Param("createdById") UUID createdById,
            @Param("paperType") PaperType paperType, Pageable pageable);

    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.subject.id = :subjectId AND p.paperType = :paperType AND p.status = :status ORDER BY p.createdAt DESC")
    List<Paper> findBySubjectIdAndPaperTypeAndStatus(@Param("subjectId") UUID subjectId,
            @Param("paperType") PaperType paperType, @Param("status") PaperStatus status);

    @Query("SELECT DISTINCT p.subject FROM Paper p WHERE p.paperType = :paperType AND p.status = :status")
    List<com.piriven.mcq.subject.entity.Subject> findDistinctSubjectsByPaperTypeAndStatus(
            @Param("paperType") PaperType paperType, @Param("status") PaperStatus status);
}
