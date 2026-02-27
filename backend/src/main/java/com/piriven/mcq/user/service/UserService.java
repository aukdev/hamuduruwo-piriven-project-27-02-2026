package com.piriven.mcq.user.service;

import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.common.exception.ResourceNotFoundException;
import com.piriven.mcq.user.dto.UserDto;
import com.piriven.mcq.user.entity.Role;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.entity.UserStatus;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
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
