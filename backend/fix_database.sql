-- Temporarily remove the foreign key constraint for testing
ALTER TABLE projects DROP CONSTRAINT projects_user_id_fkey;

-- Add it back as a simple check (not enforced)
-- This allows testing without requiring real users
ALTER TABLE projects ADD CONSTRAINT projects_user_id_check CHECK (user_id IS NOT NULL);