-- Add year column to questions table
ALTER TABLE questions ADD COLUMN year INTEGER;

-- Set default value for existing rows (current year)
UPDATE questions SET year = EXTRACT(YEAR FROM created_at)::INTEGER;

-- Now make it NOT NULL
ALTER TABLE questions ALTER COLUMN year SET NOT NULL;

-- Add check constraint to validate year range
ALTER TABLE questions ADD CONSTRAINT chk_question_year CHECK (year >= 2000 AND year <= 2100);
