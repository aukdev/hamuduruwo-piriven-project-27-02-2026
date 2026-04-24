-- =====================================================
-- V3: Restructure papers to be organized by subject
-- instead of paper_no. One paper per (year, subject).
-- =====================================================

-- Clear dependent data (dev-only migration)
TRUNCATE attempt_answers CASCADE;
TRUNCATE attempts CASCADE;
TRUNCATE paper_questions CASCADE;
TRUNCATE papers CASCADE;

-- Drop old constraints and column
ALTER TABLE papers DROP CONSTRAINT IF EXISTS papers_year_paper_no_key;
ALTER TABLE papers DROP COLUMN paper_no;

-- Add subject reference
ALTER TABLE papers ADD COLUMN subject_id UUID NOT NULL REFERENCES subjects(id);

-- Unique: one paper per year per subject
ALTER TABLE papers ADD CONSTRAINT papers_year_subject_unique UNIQUE(year, subject_id);

-- Widen year range
ALTER TABLE papers DROP CONSTRAINT IF EXISTS papers_year_check;
ALTER TABLE papers ADD CONSTRAINT papers_year_check CHECK (year BETWEEN 2000 AND 2100);

-- Add index
CREATE INDEX idx_papers_subject ON papers(subject_id);

-- Re-seed: one paper per subject per year (2017-2025)
INSERT INTO papers (id, year, subject_id, duration_seconds, question_count)
SELECT gen_random_uuid(), y.yr, s.id, 1200, 40
FROM generate_series(2017, 2025) AS y(yr)
CROSS JOIN subjects s;
