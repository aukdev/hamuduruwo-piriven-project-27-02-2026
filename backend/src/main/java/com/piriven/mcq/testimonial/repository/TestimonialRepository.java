package com.piriven.mcq.testimonial.repository;

import com.piriven.mcq.testimonial.entity.Testimonial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, UUID> {

    Optional<Testimonial> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    List<Testimonial> findByIsPublishedTrueOrderByCreatedAtDesc();

    Page<Testimonial> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT t FROM Testimonial t WHERE t.isFormEnabled = true ORDER BY t.createdAt DESC")
    List<Testimonial> findAllFormEnabled();

    @Query("SELECT t FROM Testimonial t WHERE t.quote IS NOT NULL AND t.quote <> '' ORDER BY t.createdAt DESC")
    Page<Testimonial> findAllSubmitted(Pageable pageable);
}
