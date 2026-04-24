package com.piriven.mcq.vichara.repository;

import com.piriven.mcq.vichara.entity.Vichara;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VcharaRepository extends JpaRepository<Vichara, UUID> {

    Page<Vichara> findByVcharaSubjectIdOrderByCreatedAtDesc(UUID vcharaSubjectId, Pageable pageable);
}
