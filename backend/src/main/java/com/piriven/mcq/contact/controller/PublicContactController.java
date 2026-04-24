package com.piriven.mcq.contact.controller;

import com.piriven.mcq.contact.dto.CreateContactMessageRequest;
import com.piriven.mcq.contact.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/contact")
@RequiredArgsConstructor
public class PublicContactController {

    private final ContactMessageService contactMessageService;

    @PostMapping
    public ResponseEntity<Void> submit(@Valid @RequestBody CreateContactMessageRequest request) {
        contactMessageService.create(request);
        return ResponseEntity.accepted().build();
    }
}
