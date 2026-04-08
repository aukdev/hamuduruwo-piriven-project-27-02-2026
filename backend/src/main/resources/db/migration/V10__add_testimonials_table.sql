-- Testimonials table for user feedback system
CREATE TABLE testimonials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    quote           TEXT,
    position_title  VARCHAR(200),
    rating          INT CHECK (rating >= 1 AND rating <= 5),
    photo_data      BYTEA,
    photo_content_type VARCHAR(50),
    is_published    BOOLEAN NOT NULL DEFAULT false,
    is_form_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_testimonials_published ON testimonials(is_published);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at);
