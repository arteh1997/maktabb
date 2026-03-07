-- Maktabb initial schema
-- Multi-tenant school management platform

-- Custom types
CREATE TYPE teacher_role AS ENUM ('admin', 'teacher');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'trialing');
CREATE TYPE payment_method AS ENUM ('stripe', 'cash', 'bank_transfer');

-- ============================================================
-- TABLES
-- ============================================================

-- Schools (top-level tenant)
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  postcode text,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_status subscription_status NOT NULL DEFAULT 'active',
  stripe_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Teachers (includes admins)
CREATE TABLE teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  auth_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role teacher_role NOT NULL DEFAULT 'teacher',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX teachers_auth_user_id_idx ON teachers(auth_user_id);
CREATE INDEX teachers_school_id_idx ON teachers(school_id);

-- Classes
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  teacher_id uuid REFERENCES teachers(id) ON DELETE SET NULL,
  year_group text,
  meeting_days text[], -- e.g. ['saturday', 'sunday']
  academic_year text NOT NULL, -- e.g. '2025-2026'
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX classes_school_id_idx ON classes(school_id);
CREATE INDEX classes_teacher_id_idx ON classes(teacher_id);

-- Students
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  date_of_birth date,
  gender gender_type,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX students_school_id_idx ON students(school_id);

-- Class enrolments (many-to-many: students <-> classes)
CREATE TABLE class_enrolments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  left_at timestamptz
);

CREATE UNIQUE INDEX class_enrolments_active_idx
  ON class_enrolments(student_id, class_id) WHERE left_at IS NULL;
CREATE INDEX class_enrolments_class_id_idx ON class_enrolments(class_id);
CREATE INDEX class_enrolments_student_id_idx ON class_enrolments(student_id);

-- Parents
CREATE TABLE parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  consent_given_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX parents_auth_user_id_idx ON parents(auth_user_id);
CREATE INDEX parents_school_id_idx ON parents(school_id);
CREATE INDEX parents_student_id_idx ON parents(student_id);

-- Attendance records
CREATE TABLE attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date date NOT NULL,
  status attendance_status NOT NULL,
  marked_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX attendance_student_date_class_idx
  ON attendance_records(student_id, class_id, date);
CREATE INDEX attendance_school_id_idx ON attendance_records(school_id);
CREATE INDEX attendance_class_id_idx ON attendance_records(class_id);

-- Quran progress
CREATE TABLE quran_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date date NOT NULL,
  sabaq_surah text,
  sabaq_ayah_from integer,
  sabaq_ayah_to integer,
  sabqi text,
  manzil text,
  notes text,
  recorded_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX quran_progress_school_id_idx ON quran_progress(school_id);
CREATE INDEX quran_progress_student_id_idx ON quran_progress(student_id);

-- Fee records
CREATE TABLE fee_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  amount_pence integer NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  payment_method payment_method,
  stripe_payment_intent_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX fee_records_school_id_idx ON fee_records(school_id);
CREATE INDEX fee_records_student_id_idx ON fee_records(student_id);

-- Homework
CREATE TABLE homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  set_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX homework_school_id_idx ON homework(school_id);
CREATE INDEX homework_class_id_idx ON homework(class_id);

-- Announcements
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  created_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

CREATE INDEX announcements_school_id_idx ON announcements(school_id);

-- Reports
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  term text NOT NULL,
  academic_year text NOT NULL,
  generated_by uuid REFERENCES teachers(id) ON DELETE SET NULL,
  storage_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX reports_school_id_idx ON reports(school_id);
CREATE INDEX reports_student_id_idx ON reports(student_id);
