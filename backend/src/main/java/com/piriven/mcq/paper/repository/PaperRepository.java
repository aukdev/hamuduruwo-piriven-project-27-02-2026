package com.piriven.mcq.paper.repository;

import com.piriven.mcq.paper.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaperRepository extends JpaRepository<Paper, UUID> {

    @Query("SELECT p FROM Paper p JOIN FETCH p.subject WHERE p.year = :year ORDER BY p.subject.name")
    List<Paper> findByYearWithSubject(@Param("year") int year);

    Optional<Paper> findByYearAndSubjectId(int year, UUID subjectId);

    boolean existsByYearAndSubjectId(int year, UUID subjectId);

    @Query("SELECT DISTINCT p.year FROM Paper p ORDER BY p.year")
    List<Integer> findDistinctYears();
}
