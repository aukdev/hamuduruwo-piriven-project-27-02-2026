-- =====================================================
-- V2: Seed initial data
-- =====================================================

-- Seed Super Admin (password: SuperAdmin@123)
INSERT INTO users (id, email, password, full_name, role, status, teacher_verified)
VALUES (
    gen_random_uuid(),
    'superadmin@piriven.com',
    crypt('SuperAdmin@123', gen_salt('bf', 10)),
    'Super Administrator',
    'SUPER_ADMIN',
    'ACTIVE',
    FALSE
);

-- Seed Admin (password: Admin@123)
INSERT INTO users (id, email, password, full_name, role, status, teacher_verified)
VALUES (
    gen_random_uuid(),
    'admin@piriven.com',
    crypt('Admin@123', gen_salt('bf', 10)),
    'Administrator',
    'ADMIN',
    'ACTIVE',
    FALSE
);

-- Seed Subjects
INSERT INTO subjects (id, name, description) VALUES
    (gen_random_uuid(), 'බුද්ධ ධර්මය', 'Buddhist Dhamma studies'),
    (gen_random_uuid(), 'පාලි', 'Pali language studies'),
    (gen_random_uuid(), 'සංස්කෘත', 'Sanskrit language studies'),
    (gen_random_uuid(), 'ඉතිහාසය', 'History of Buddhism'),
    (gen_random_uuid(), 'විනය', 'Vinaya Pitaka studies');

-- Seed Papers: Years 2017..2025, each year has 9 papers (paper_no 1..9)
DO $$
DECLARE
    yr  INTEGER;
    pno INTEGER;
BEGIN
    FOR yr IN 2017..2025 LOOP
        FOR pno IN 1..9 LOOP
            INSERT INTO papers (id, year, paper_no, duration_seconds, question_count)
            VALUES (gen_random_uuid(), yr, pno, 1200, 40);
        END LOOP;
    END LOOP;
END $$;
