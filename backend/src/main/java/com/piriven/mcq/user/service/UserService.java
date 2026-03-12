package com.piriven.mcq.user.service;

import com.piriven.mcq.common.dto.PagedResponse;
import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.common.util.PaginationUtil;
import com.piriven.mcq.user.dto.CreateUserRequest;
import com.piriven.mcq.user.dto.ResetPasswordRequest;
import com.piriven.mcq.user.dto.UserDto;
import com.piriven.mcq.user.dto.UserUpdateRequest;
import com.piriven.mcq.user.entity.Role;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.entity.UserStatus;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email is already registered", HttpStatus.CONFLICT);
        }

        Role role = Role.valueOf(request.role());
        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(role)
                .status(UserStatus.ACTIVE)
                .teacherVerified(false)
                .build();

        user = userRepository.save(user);
        return toDto(user);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDto> getAllUsers(int page, int size) {
        PageRequest pageRequest = PaginationUtil.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage = userRepository.findAll(pageRequest);
        return buildPagedResponse(userPage);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDto> getAllUsersForSuperAdmin(int page, int size) {
        PageRequest pageRequest = PaginationUtil.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage = userRepository.findAll(pageRequest);
        return buildPagedResponse(userPage);
    }

    private PagedResponse<UserDto> buildPagedResponse(Page<User> page) {
        List<UserDto> content = page.getContent().stream()
                .map(this::toDto)
                .toList();

        return PagedResponse.<UserDto>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public UserDto deactivateUser(UUID userId) {
        User user = getUserById(userId);

        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new BusinessException("Cannot deactivate a Super Admin", HttpStatus.FORBIDDEN);
        }

        if (user.getStatus() == UserStatus.DEACTIVATED) {
            throw new BusinessException("User is already deactivated");
        }

        user.setStatus(UserStatus.DEACTIVATED);
        user = userRepository.save(user);
        return toDto(user);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = getUserById(userId);

        if (user.getRole() == Role.SUPER_ADMIN) {
            throw new BusinessException("Cannot delete a Super Admin", HttpStatus.FORBIDDEN);
        }

        userRepository.delete(user);
    }

    @Transactional
    public UserDto verifyTeacher(UUID teacherId) {
        User teacher = getUserById(teacherId);

        if (teacher.getRole() != Role.TEACHER) {
            throw new BusinessException("User is not a teacher");
        }

        if (teacher.isTeacherVerified()) {
            throw new BusinessException("Teacher is already verified");
        }

        teacher.setTeacherVerified(true);
        teacher = userRepository.save(teacher);
        return toDto(teacher);
    }

    @Transactional
    public UserDto updateUser(UUID userId, UserUpdateRequest request) {
        User user = getUserById(userId);

        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setRole(Role.valueOf(request.role()));
        user.setStatus(UserStatus.valueOf(request.status()));
        if (request.teacherVerified() != null) {
            user.setTeacherVerified(request.teacherVerified());
        }

        user = userRepository.save(user);
        return toDto(user);
    }

    @Transactional
    public void resetPassword(UUID userId, ResetPasswordRequest request) {
        User user = getUserById(userId);
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserDto activateUser(UUID userId) {
        User user = getUserById(userId);
        if (user.getStatus() == UserStatus.ACTIVE) {
            throw new BusinessException("User is already active");
        }
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);
        return toDto(user);
    }

    public UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.getStatus().name(),
                user.isTeacherVerified(),
                user.getCreatedAt());
    }
}
