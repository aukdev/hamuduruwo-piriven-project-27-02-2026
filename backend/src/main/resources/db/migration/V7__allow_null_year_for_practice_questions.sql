-- Allow NULL year for questions linked to practice papers (practice papers have no year)
ALTER TABLE questions ALTER COLUMN year DROP NOT NULL;
