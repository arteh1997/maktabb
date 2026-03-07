-- Maktabb seed data
-- Creates one test school with admin, teacher, class, students, and sample records.
-- NOTE: auth.users rows must be created separately via Supabase Auth.
-- This seed uses placeholder UUIDs for auth_user_id that should be replaced
-- after creating actual auth users.

-- Test school
INSERT INTO schools (id, name, address, postcode, subscription_tier, subscription_status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Al-Noor Maktab',
  '123 Mosque Road',
  'E1 1AA',
  'starter',
  'active'
);

-- Admin teacher (auth_user_id placeholder — replace after creating auth user)
INSERT INTO teachers (id, school_id, auth_user_id, name, email, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-aaaaaaaaaaaa', -- placeholder
  'Imam Ahmed',
  'admin@alnoor.test',
  'admin',
  true
);

-- Regular teacher
INSERT INTO teachers (id, school_id, auth_user_id, name, email, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-bbbbbbbbbbbb', -- placeholder
  'Ustadh Bilal',
  'bilal@alnoor.test',
  'teacher',
  true
);

-- Class
INSERT INTO classes (id, school_id, name, teacher_id, year_group, meeting_days, academic_year)
VALUES (
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000001',
  'Quran Hifz - Year 3',
  '00000000-0000-0000-0000-000000000011',
  'Year 3',
  ARRAY['saturday', 'sunday'],
  '2025-2026'
);

-- 5 Students
INSERT INTO students (id, school_id, name, date_of_birth, gender)
VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', 'Yusuf Ali', '2016-03-15', 'male'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000001', 'Aisha Khan', '2016-07-22', 'female'),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000001', 'Ibrahim Hassan', '2015-11-08', 'male'),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000001', 'Maryam Patel', '2016-01-30', 'female'),
  ('00000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000001', 'Omar Mahmoud', '2015-09-12', 'male');

-- Enrol all 5 students in the class
INSERT INTO class_enrolments (student_id, class_id)
VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000020'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000020'),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000020'),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000020'),
  ('00000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000020');

-- Parent for Yusuf
INSERT INTO parents (id, student_id, school_id, auth_user_id, name, email, phone)
VALUES (
  '00000000-0000-0000-0000-000000000040',
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-cccccccccccc', -- placeholder
  'Mr Ali',
  'ali.parent@test.com',
  '+447700900000'
);

-- Sample attendance records (last Saturday)
INSERT INTO attendance_records (student_id, class_id, school_id, date, status, marked_by)
VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '2026-03-01', 'present', '00000000-0000-0000-0000-000000000011'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '2026-03-01', 'present', '00000000-0000-0000-0000-000000000011'),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '2026-03-01', 'absent', '00000000-0000-0000-0000-000000000011'),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '2026-03-01', 'late', '00000000-0000-0000-0000-000000000011'),
  ('00000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '2026-03-01', 'present', '00000000-0000-0000-0000-000000000011');

-- Sample Quran progress
INSERT INTO quran_progress (student_id, class_id, school_id, date, sabaq_surah, sabaq_ayah_from, sabaq_ayah_to, sabqi, manzil, notes, recorded_by)
VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '2026-03-01', 'Al-Baqarah', 1, 5, 'Al-Fatihah', NULL, 'Good tajweed, needs to work on makhaarij', '00000000-0000-0000-0000-000000000011'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', '2026-03-01', 'Al-Baqarah', 6, 10, 'Al-Fatihah', NULL, 'Excellent memorisation', '00000000-0000-0000-0000-000000000011');

-- Sample fee record
INSERT INTO fee_records (student_id, school_id, amount_pence, due_date, paid_date, payment_method)
VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', 5000, '2026-03-01', '2026-02-28', 'cash');
