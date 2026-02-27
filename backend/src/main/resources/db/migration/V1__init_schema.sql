-- =====================================================
-- V1: Initial Schema for MCQ Past Paper System
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT')),
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DEACTIVATED')),
    teacher_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- SUBJECTS
-- =====================================================
CREATE TABLE subjects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TEACHER-SUBJECT ASSIGNMENT
-- =====================================================
CREATE TABLE teacher_subjects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(teacher_id, subject_id)
);

CREATE INDEX idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX idx_teacher_subjects_subject ON teacher_subjects(subject_id);

-- =====================================================
-- QUESTIONS
-- =====================================================
CREATE TABLE questions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id       UUID        NOT NULL REFERENCES subjects(id),
    created_by       UUID        NOT NULL REFERENCES users(id),
    question_text    TEXT        NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                     CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    approved_by      UUID        REFERENCES users(id),
    approved_at      TIMESTAMP,
    version          INTEGER     NOT NULL DEFAULT 0,
    created_at       TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_questions_created_by ON questions(created_by);

-- =====================================================
-- QUESTION OPTIONS
-- =====================================================
CREATE TABLE question_options (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id  UUID    NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_text  TEXT    NOT NULL,
    is_correct   BOOLEAN NOT NULL DEFAULT FALSE,
    option_order INTEGER NOT NULL CHECK (option_order BETWEEN 1 AND 4),
    UNIQUE(question_id, option_order)
);

CREATE INDEX idx_question_options_question ON question_options(question_id);

-- =====================================================
-- PAPERS
-- =====================================================
CREATE TABLE papers (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year             INTEGER NOT NULL CHECK (year BETWEEN 2017 AND 2025),
    paper_no         INTEGER NOT NULL CHECK (paper_no BETWEEN 1 AND 9),
    duration_seconds INTEGER NOT NULL DEFAULT 1200,
    question_count   INTEGER NOT NULL DEFAULT 40,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(year, paper_no)
);

CREATE INDEX idx_papers_year ON papers(year);

-- =====================================================
-- PAPER-QUESTION MAPPING
-- =====================================================
CREATE TABLE paper_questions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id    UUID    NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    question_id UUID    NOT NULL REFERENCES questions(id),
    position    INTEGER NOT NULL CHECK (position BETWEEN 1 AND 40),
    UNIQUE(paper_id, position),
    UNIQUE(paper_id, question_id)
);

CREATE INDEX idx_paper_questions_paper ON paper_questions(paper_id);

-- =====================================================
-- ATTEMPTS
-- =====================================================
CREATE TABLE attempts (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id    UUID        NOT NULL REFERENCES users(id),
    paper_id      UUID        NOT NULL REFERENCES papers(id),
    attempt_no    INTEGER     NOT NULL CHECK (attempt_no BETWEEN 1 AND 10),
    status        VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS'
                  CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED')),
    started_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    expires_at    TIMESTAMP   NOT NULL,
    submitted_at  TIMESTAMP,
    correct_count INTEGER     DEFAULT 0,
    wrong_count   INTEGER     DEFAULT 0,
    score         INTEGER     DEFAULT 0,
    created_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, paper_id, attempt_no)
);

CREATE INDEX idx_attempts_student ON attempts(student_id);
CREATE INDEX idx_attempts_paper ON attempts(paper_id);
CREATE INDEX idx_attempts_status ON attempts(status);

-- =====================================================
-- ATTEMPT ANSWERS
-- =====================================================
CREATE TABLE attempt_answers (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id        UUID      NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    paper_question_id UUID      NOT NULL REFERENCES paper_questions(id),
    question_id       UUID      NOT NULL REFERENCES questions(id),
    selected_option_id UUID     REFERENCES question_options(id),
    is_correct        BOOLEAN,
    served_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    question_deadline TIMESTAMP NOT NULL,
    answered_at       TIMESTAMP,
    time_taken_seconds INTEGER,
    is_timeout        BOOLEAN   NOT NULL DEFAULT FALSE,
    UNIQUE(attempt_id, paper_question_id)
);

CREATE INDEX idx_attempt_answers_attempt ON attempt_answers(attempt_id);

-- =====================================================
-- DB-LEVEL TRIGGER: Validate question has exactly 4 options
-- with exactly 1 correct BEFORE approval
-- =====================================================
CREATE OR REPLACE FUNCTION validate_question_for_approval()
RETURNS TRIGGER AS $$
DECLARE
    opt_count   INTEGER;
    correct_cnt INTEGER;
BEGIN
    IF NEW.status = 'APPROVED' THEN
        SELECT COUNT(*), COUNT(*) FILTER (WHERE is_correct = TRUE)
        INTO opt_count, correct_cnt
        FROM question_options
        WHERE question_id = NEW.id;

        IF opt_count != 4 THEN
            RAISE EXCEPTION 'Question must have exactly 4 options to be approved (found %)', opt_count;
        END IF;

        IF correct_cnt != 1 THEN
            RAISE EXCEPTION 'Question must have exactly 1 correct option to be approved (found %)', correct_cnt;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_question_approval
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION validate_question_for_approval();

-- =====================================================
-- DB-LEVEL TRIGGER: Prevent more than 4 options per question
-- =====================================================
CREATE OR REPLACE FUNCTION check_max_options()
RETURNS TRIGGER AS $$
DECLARE
    opt_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO opt_count
    FROM question_options
    WHERE question_id = NEW.question_id;

    -- On INSERT this fires BEFORE so current row not yet counted
    -- We use AFTER trigger so count includes the new row
    IF opt_count > 4 THEN
        RAISE EXCEPTION 'Question cannot have more than 4 options';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_max_options
    AFTER INSERT ON question_options
    FOR EACH ROW
    EXECUTE FUNCTION check_max_options();

-- =====================================================
-- DB-LEVEL TRIGGER: Prevent more than 1 correct option
-- =====================================================
CREATE OR REPLACE FUNCTION check_single_correct()
RETURNS TRIGGER AS $$
DECLARE
    correct_cnt INTEGER;
BEGIN
    IF NEW.is_correct = TRUE THEN
        SELECT COUNT(*) INTO correct_cnt
        FROM question_options
        WHERE question_id = NEW.question_id AND is_correct = TRUE;

        IF correct_cnt > 1 THEN
            RAISE EXCEPTION 'Question cannot have more than 1 correct option';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_single_correct
    AFTER INSERT OR UPDATE ON question_options
    FOR EACH ROW
    EXECUTE FUNCTION check_single_correct();
