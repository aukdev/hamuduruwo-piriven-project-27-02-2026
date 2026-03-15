package com.piriven.mcq.user.controller;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.user.dto.CreateUserRequest;
import com.piriven.mcq.user.dto.ResetPasswordRequest;
import com.piriven.mcq.user.dto.UserDto;
import com.piriven.mcq.user.dto.UserUpdateRequest;
import com.piriven.mcq.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/superadmin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@RequiredArgsConstructor
public class SuperAdminUserController {

    private final UserService userService;

    @PostMapping("/users")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<UserDto> response = userService.getAllUsersForSuperAdmin(page, size);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable UUID id,
            @Valid @RequestBody UserUpdateRequest request) {
        UserDto user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable UUID id,
            @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/deactivate")
    public ResponseEntity<UserDto> deactivateUser(@PathVariable UUID id) {
        UserDto user = userService.deactivateUser(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/users/{id}/activate")
    public ResponseEntity<UserDto> activateUser(@PathVariable UUID id) {
        UserDto user = userService.activateUser(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/teachers/{id}/verify")
    public ResponseEntity<UserDto> verifyTeacher(@PathVariable UUID id) {
        UserDto user = userService.verifyTeacher(id);
        return ResponseEntity.ok(user);
    }
}
