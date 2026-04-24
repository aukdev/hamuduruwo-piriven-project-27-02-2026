package com.piriven.mcq.contact.service;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.contact.dto.ContactMessageDto;
import com.piriven.mcq.contact.dto.CreateContactMessageRequest;
import com.piriven.mcq.contact.entity.ContactMessage;
import com.piriven.mcq.contact.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    /* ── Public: create ── */

    @Transactional
    public ContactMessageDto create(CreateContactMessageRequest req) {
        ContactMessage m = ContactMessage.builder()
                .name(req.name().trim())
                .email(req.email().trim())
                .subject(req.subject() == null ? null : req.subject().trim())
                .message(req.message().trim())
                .isRead(false)
                .build();
        return toDto(contactMessageRepository.save(m));
    }

    /* ── Admin: list / view / update / delete ── */

    @Transactional(readOnly = true)
    public PagedResponse<ContactMessageDto> list(int page, int size) {
        Page<ContactMessage> p = contactMessageRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return PagedResponse.<ContactMessageDto>builder()
                .content(p.getContent().stream().map(this::toDto).toList())
                .page(p.getNumber())
                .size(p.getSize())
                .totalElements(p.getTotalElements())
                .totalPages(p.getTotalPages())
                .last(p.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public ContactMessageDto get(UUID id) {
        return toDto(find(id));
    }

    @Transactional
    public ContactMessageDto markRead(UUID id, boolean read) {
        ContactMessage m = find(id);
        m.setRead(read);
        return toDto(contactMessageRepository.save(m));
    }

    @Transactional
    public void delete(UUID id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new RuntimeException("පණිවිඩය හමු නොවීය");
        }
        contactMessageRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public long unreadCount() {
        return contactMessageRepository.countByIsReadFalse();
    }

    /* ── helpers ── */

    private ContactMessage find(UUID id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("පණිවිඩය හමු නොවීය"));
    }

    private ContactMessageDto toDto(ContactMessage m) {
        return new ContactMessageDto(
                m.getId(),
                m.getName(),
                m.getEmail(),
                m.getSubject(),
                m.getMessage(),
                m.isRead(),
                m.getCreatedAt(),
                m.getUpdatedAt());
    }
}
