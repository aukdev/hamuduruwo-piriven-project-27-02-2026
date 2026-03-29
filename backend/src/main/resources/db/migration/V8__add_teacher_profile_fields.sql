-- =====================================================
-- V8: Add teacher profile fields (piriven name, address, phone)
-- =====================================================

ALTER TABLE users ADD COLUMN piriven_name VARCHAR(255);
ALTER TABLE users ADD COLUMN piriven_address VARCHAR(500);
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
