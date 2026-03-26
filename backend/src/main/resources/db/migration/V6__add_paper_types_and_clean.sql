-- ============================================================
-- V6: Add paper_type and paper_status to papers table
--     Clean existing data for fresh start
-- ============================================================

-- Step 1: Clean existing data (order matters for FK constraints)
DELETE FROM attempt_answers;
DELETE FROM attempts;
DELETE FROM paper_questions;
DELETE FROM question_options;
DELETE FROM questions;
DELETE FROM papers;

-- Keep users (super_admin, admin), subjects, teacher_subjects

-- Step 2: Add new columns to papers table
ALTER TABLE papers ADD COLUMN paper_type VARCHAR(20) NOT NULL DEFAULT 'PAST_PAPER';
ALTER TABLE papers ADD COLUMN title VARCHAR(500);
ALTER TABLE papers ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'APPROVED';
ALTER TABLE papers ADD COLUMN created_by UUID REFERENCES users(id);
ALTER TABLE papers ADD COLUMN approved_by UUID REFERENCES users(id);
ALTER TABLE papers ADD COLUMN rejection_reason TEXT;
ALTER TABLE papers ADD COLUMN approved_at TIMESTAMP;

-- Step 3: Drop existing unique constraint and replace with partial unique index
ALTER TABLE papers DROP CONSTRAINT IF EXISTS papers_year_subject_id_key;
ALTER TABLE papers DROP CONSTRAINT IF EXISTS uk_papers_year_subject;

-- Past papers: one per year per subject
CREATE UNIQUE INDEX uq_past_paper_year_subject ON papers (year, subject_id) WHERE paper_type = 'PAST_PAPER';

-- Step 4: Add check constraints
ALTER TABLE papers ADD CONSTRAINT chk_paper_type CHECK (paper_type IN ('PAST_PAPER', 'PRACTICE'));
ALTER TABLE papers ADD CONSTRAINT chk_paper_status CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'));

-- Step 5: Practice papers must have a title
-- (enforced at application level, not DB constraint, since past papers don't need title)

-- Step 6: Indexes for new columns
CREATE INDEX idx_papers_paper_type ON papers(paper_type);
CREATE INDEX idx_papers_status ON papers(status);
CREATE INDEX idx_papers_created_by ON papers(created_by);
CREATE INDEX idx_papers_type_status ON papers(paper_type, status);

-- Step 7: Make year nullable for practice papers (they don't need a year)
ALTER TABLE papers ALTER COLUMN year DROP NOT NULL;
