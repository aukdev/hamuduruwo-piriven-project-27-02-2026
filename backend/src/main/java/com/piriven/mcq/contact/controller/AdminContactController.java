package com.piriven.mcq.contact.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.contact.dto.ContactMessageDto;
import com.piriven.mcq.contact.dto.UnreadCountDto;
import com.piriven.mcq.contact.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/contact-messages")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactMessageService contactMessageService;

    @GetMapping
    public ResponseEntity<PagedResponse<ContactMessageDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(contactMessageService.list(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessageDto> get(@PathVariable UUID id) {
        return ResponseEntity.ok(contactMessageService.get(id));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ContactMessageDto> markRead(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "true") boolean read) {
        return ResponseEntity.ok(contactMessageService.markRead(id, read));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        contactMessageService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountDto> unreadCount() {
        return ResponseEntity.ok(new UnreadCountDto(contactMessageService.unreadCount()));
    }
}
