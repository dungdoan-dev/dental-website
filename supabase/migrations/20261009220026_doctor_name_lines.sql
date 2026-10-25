-- Allow administrators to choose whether a doctor's name uses one or two lines on cards.
ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS name_lines INTEGER NOT NULL DEFAULT 1;

ALTER TABLE doctors
  DROP CONSTRAINT IF EXISTS doctors_name_lines_check;

ALTER TABLE doctors
  ADD CONSTRAINT doctors_name_lines_check CHECK (name_lines IN (1, 2));
