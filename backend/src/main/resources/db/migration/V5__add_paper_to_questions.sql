-- Add paper reference to questions table
ALTER TABLE questions ADD COLUMN paper_id UUID REFERENCES papers(id);

-- Link existing questions to papers by matching subject_id + year
UPDATE questions q
SET paper_id = p.id
FROM papers p
WHERE q.subject_id = p.subject_id AND q.year = p.year;

-- Widen paper_questions position constraint (was 1-40, now supports higher question counts)
ALTER TABLE paper_questions DROP CONSTRAINT IF EXISTS paper_questions_position_check;
ALTER TABLE paper_questions ADD CONSTRAINT paper_questions_position_check CHECK (position BETWEEN 1 AND 200);

-- Index for paper_id on questions
CREATE INDEX idx_questions_paper ON questions(paper_id);
