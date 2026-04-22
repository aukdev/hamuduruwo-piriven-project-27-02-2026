package com.piriven.mcq.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateContactMessageRequest(
        @NotBlank(message = "නම අවශ්‍ය වේ") @Size(max = 150) String name,

        @NotBlank(message = "ඊමේල් ලිපිනය අවශ්‍ය වේ") @Email(message = "වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න") @Size(max = 200) String email,

        @Size(max = 255) String subject,

        @NotBlank(message = "පණිවිඩය අවශ්‍ය වේ") @Size(max = 5000, message = "පණිවිඩය අකුරු 5000 ට වඩා අඩු විය යුතුය") String message) {
}
