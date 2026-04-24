package com.piriven.mcq.testimonial.entity;

import com.piriven.mcq.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "testimonials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String quote;

    @Column(name = "position_title", length = 200)
    private String positionTitle;

    @Column
    private Integer rating;

    @Basic(fetch = FetchType.LAZY)
    @Column(name = "photo_data")
    private byte[] photoData;

    @Column(name = "photo_content_type", length = 50)
    private String photoContentType;

    @Column(name = "is_published", nullable = false)
    private boolean isPublished;

    @Column(name = "is_form_enabled", nullable = false)
    private boolean isFormEnabled;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isSubmitted() {
        return quote != null && !quote.isBlank();
    }
}
