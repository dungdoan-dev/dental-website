-- Store the optional second line used on doctor cards.
ALTER TABLE doctors
  ADD COLUMN IF NOT EXISTS name_line_2 TEXT;
