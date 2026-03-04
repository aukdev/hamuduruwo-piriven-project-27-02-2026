package com.piriven.mcq.user.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.user.dto.UserDto;
import com.piriven.mcq.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<PagedResponse<UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<UserDto> response = userService.getAllUsers(page, size);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/users/{id}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<UserDto> deactivateUser(@PathVariable UUID id) {
        UserDto user = userService.deactivateUser(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/teachers/{id}/verify")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<UserDto> verifyTeacher(@PathVariable UUID id) {
        UserDto user = userService.verifyTeacher(id);
        return ResponseEntity.ok(user);
    }
}
