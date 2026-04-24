package com.piriven.mcq.auth.service;

import com.piriven.mcq.auth.dto.AuthResponse;
import com.piriven.mcq.auth.dto.LoginRequest;
import com.piriven.mcq.auth.dto.RegisterRequest;
import com.piriven.mcq.common.exception.BusinessException;
import com.piriven.mcq.security.JwtTokenProvider;
import com.piriven.mcq.security.UserPrincipal;
import com.piriven.mcq.user.entity.Role;
import com.piriven.mcq.user.entity.User;
import com.piriven.mcq.user.entity.UserStatus;
import com.piriven.mcq.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email is already registered", HttpStatus.CONFLICT);
        }

        Role role = Role.valueOf(request.role());
        if (role != Role.TEACHER && role != Role.STUDENT) {
            throw new BusinessException("Only TEACHER or STUDENT roles can be registered publicly");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(role)
                .status(UserStatus.ACTIVE)
                .teacherVerified(false)
                .build();

        if (role == Role.TEACHER) {
            user.setPirivenName(request.pirivenName());
            user.setPirivenAddress(request.pirivenAddress());
            user.setPhoneNumber(request.phoneNumber());
        }

        user = userRepository.save(user);

        if (role == Role.TEACHER) {
            return new AuthResponse(null, user.getId(), user.getEmail(),
                    user.getFullName(), user.getRole().name());
        }

        String token = tokenProvider.generateTokenFromUserId(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getEmail(),
                user.getFullName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException("User not found"));

        if (user.getRole() == Role.TEACHER && !user.isTeacherVerified()) {
            throw new BusinessException(
                    "ඔබගේ ගිණුම තවම සත්‍යාපනය කර නොමැත. කරුණාකර පරිපාලක අනුමැතිය සඳහා රැඳී සිටින්න.",
                    HttpStatus.FORBIDDEN);
        }

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getId(), user.getEmail(),
                user.getFullName(), user.getRole().name());
    }
}
