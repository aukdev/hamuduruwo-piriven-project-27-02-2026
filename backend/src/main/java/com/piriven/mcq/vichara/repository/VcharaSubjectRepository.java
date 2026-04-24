package com.piriven.mcq.vichara.repository;

import com.piriven.mcq.vichara.entity.VcharaSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VcharaSubjectRepository extends JpaRepository<VcharaSubject, UUID> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, UUID id);

    List<VcharaSubject> findAllByOrderByDisplayOrderAsc();
}
