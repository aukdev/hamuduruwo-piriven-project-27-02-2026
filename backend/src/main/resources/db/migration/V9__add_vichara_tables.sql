-- =====================================================
-- V9: Add Vichara (Commentary) tables
-- =====================================================

-- =====================================================
-- VICHARA SUBJECTS (separate from exam subjects)
-- =====================================================
CREATE TABLE vichara_subjects (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL UNIQUE,
    description   TEXT,
    display_order INTEGER   NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- VICHARAS (commentaries)
-- =====================================================
CREATE TABLE vicharas (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vichara_subject_id UUID         NOT NULL REFERENCES vichara_subjects(id) ON DELETE CASCADE,
    title              VARCHAR(500) NOT NULL,
    content            TEXT         NOT NULL,
    created_by         UUID         NOT NULL REFERENCES users(id),
    created_at         TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vicharas_subject    ON vicharas(vichara_subject_id);
CREATE INDEX idx_vicharas_created_at ON vicharas(created_at DESC);

-- =====================================================
-- Seed Vichara Subjects
-- =====================================================
INSERT INTO vichara_subjects (id, name, description, display_order) VALUES
    (gen_random_uuid(), 'බුද්ධ ධර්මය විචාර', 'Buddhist Dhamma commentaries', 1),
    (gen_random_uuid(), 'පාලි විචාර', 'Pali language commentaries', 2),
    (gen_random_uuid(), 'සංස්කෘත විචාර', 'Sanskrit language commentaries', 3),
    (gen_random_uuid(), 'ඉතිහාසය විචාර', 'History of Buddhism commentaries', 4),
    (gen_random_uuid(), 'විනය විචාර', 'Vinaya Pitaka commentaries', 5);
