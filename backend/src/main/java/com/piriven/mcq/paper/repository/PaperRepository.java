package com.piriven.mcq.paper.repository;

import com.piriven.mcq.paper.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaperRepository extends JpaRepository<Paper, UUID> {

    List<Paper> findByYearOrderByPaperNo(int year);

    Optional<Paper> findByYearAndPaperNo(int year, int paperNo);

    @Query("SELECT DISTINCT p.year FROM Paper p ORDER BY p.year")
    List<Integer> findDistinctYears();
}
