package com.piriven.mcq.contact.repository;

import com.piriven.mcq.contact.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByIsReadFalse();
}
