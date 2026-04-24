package com.piriven.mcq.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .status(HttpStatus.NOT_FOUND.value())
                                .error("Not Found")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<ApiError> handleBusinessException(BusinessException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .status(ex.getStatus().value())
                                .error(ex.getStatus().getReasonPhrase())
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.status(ex.getStatus()).body(error);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                        HttpServletRequest request) {
                BindingResult result = ex.getBindingResult();
                List<ApiError.FieldError> fieldErrors = result.getFieldErrors().stream()
                                .map(fe -> ApiError.FieldError.builder()
                                                .field(fe.getField())
                                                .message(fe.getDefaultMessage())
                                                .rejectedValue(fe.getRejectedValue())
                                                .build())
                                .toList();

                ApiError error = ApiError.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Validation Failed")
                                .message("Request validation failed")
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .fieldErrors(fieldErrors)
                                .build();
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .status(HttpStatus.UNAUTHORIZED.value())
                                .error("Unauthorized")
                                .message("Invalid email or password")
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<ApiError> handleAuth(AuthenticationException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .status(HttpStatus.UNAUTHORIZED.value())
                                .error("Unauthorized")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .status(HttpStatus.FORBIDDEN.value())
                                .error("Forbidden")
                                .message("You do not have permission to perform this action")
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
        public ResponseEntity<ApiError> handleOptimisticLock(ObjectOptimisticLockingFailureException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .status(HttpStatus.CONFLICT.value())
                                .error("Conflict")
                                .message("The resource was modified by another process. Please retry.")
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex,
                        HttpServletRequest request) {
                ApiError error = ApiError.builder()
                                .status(HttpStatus.BAD_REQUEST.value())
                                .error("Bad Request")
                                .message(ex.getMessage())
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiError> handleGeneral(Exception ex, HttpServletRequest request) {
                logger.error("Unexpected error on {} {}", request.getMethod(), request.getRequestURI(), ex);
                ApiError error = ApiError.builder()
                                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                                .error("Internal Server Error")
                                .message(ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred")
                                .path(request.getRequestURI())
                                .timestamp(LocalDateTime.now())
                                .build();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
}
