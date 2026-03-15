package com.piriven.mcq.common.controller;

import com.piriven.mcq.common.dto.PublicStatsResponse;
import com.piriven.mcq.paper.repository.PaperRepository;
import com.piriven.mcq.subject.repository.SubjectRepository;
import com.piriven.mcq.user.entity.Role;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final UserRepository userRepository;
    private final PaperRepository paperRepository;
    private final SubjectRepository subjectRepository;

    @GetMapping("/stats")
    public ResponseEntity<PublicStatsResponse> getPublicStats() {
        return ResponseEntity.ok(new PublicStatsResponse(
                userRepository.countByRole(Role.STUDENT),
                userRepository.countByRole(Role.TEACHER),
                paperRepository.count(),
                subjectRepository.count()));
    }
}
