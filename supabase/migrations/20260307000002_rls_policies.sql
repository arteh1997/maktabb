-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================
-- Every table has RLS enabled.
-- Three roles: admin (full school), teacher (own classes), parent (own child).
-- school_id isolation is the primary security boundary.

-- Helper function: get the current user's school_id from teachers table
CREATE OR REPLACE FUNCTION public.get_user_school_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM teachers WHERE auth_user_id = auth.uid()
  UNION
  SELECT school_id FROM parents WHERE auth_user_id = auth.uid()
  LIMIT 1;
$$;

-- Helper function: get the current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS teacher_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM teachers WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Helper function: check if teacher is assigned to a class
CREATE OR REPLACE FUNCTION public.is_teacher_of_class(p_class_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM classes
    WHERE id = p_class_id
    AND teacher_id = (SELECT id FROM teachers WHERE auth_user_id = auth.uid())
  );
$$;

-- Helper function: check if user is a parent
CREATE OR REPLACE FUNCTION public.is_parent()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM parents WHERE auth_user_id = auth.uid()
  );
$$;

-- Helper function: get parent's student_id
CREATE OR REPLACE FUNCTION public.get_parent_student_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT student_id FROM parents WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- SCHOOLS
-- ============================================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Admins can read their own school
CREATE POLICY "schools_select" ON schools
  FOR SELECT USING (
    id = public.get_user_school_id()
  );

-- Admins can update their own school
CREATE POLICY "schools_update" ON schools
  FOR UPDATE USING (
    id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- TEACHERS
-- ============================================================
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Admin: full access within school. Teacher: can read own school's teachers.
CREATE POLICY "teachers_select" ON teachers
  FOR SELECT USING (
    school_id = public.get_user_school_id()
  );

CREATE POLICY "teachers_insert" ON teachers
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "teachers_update" ON teachers
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "teachers_delete" ON teachers
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- CLASSES
-- ============================================================
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Admin: all classes in school. Teacher: own classes. Parent: classes their child is enrolled in.
CREATE POLICY "classes_select" ON classes
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(id)
      OR (public.is_parent() AND EXISTS (
        SELECT 1 FROM class_enrolments
        WHERE class_id = classes.id
        AND student_id = public.get_parent_student_id()
        AND left_at IS NULL
      ))
    )
  );

CREATE POLICY "classes_insert" ON classes
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "classes_update" ON classes
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "classes_delete" ON classes
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- STUDENTS
-- ============================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Admin: all students in school. Teacher: students in their classes. Parent: own child.
CREATE POLICY "students_select" ON students
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR EXISTS (
        SELECT 1 FROM class_enrolments ce
        JOIN classes c ON c.id = ce.class_id
        WHERE ce.student_id = students.id
        AND c.teacher_id = (SELECT id FROM teachers WHERE auth_user_id = auth.uid())
        AND ce.left_at IS NULL
      )
      OR (public.is_parent() AND id = public.get_parent_student_id())
    )
  );

CREATE POLICY "students_insert" ON students
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "students_update" ON students
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "students_delete" ON students
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- CLASS ENROLMENTS
-- ============================================================
ALTER TABLE class_enrolments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "class_enrolments_select" ON class_enrolments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_enrolments.class_id
      AND c.school_id = public.get_user_school_id()
    )
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
      OR (public.is_parent() AND student_id = public.get_parent_student_id())
    )
  );

CREATE POLICY "class_enrolments_insert" ON class_enrolments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_enrolments.class_id
      AND c.school_id = public.get_user_school_id()
    )
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "class_enrolments_update" ON class_enrolments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_enrolments.class_id
      AND c.school_id = public.get_user_school_id()
    )
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "class_enrolments_delete" ON class_enrolments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_enrolments.class_id
      AND c.school_id = public.get_user_school_id()
    )
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- PARENTS
-- ============================================================
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;

-- Admin: all parents in school. Parent: own record only.
CREATE POLICY "parents_select" ON parents
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR auth_user_id = auth.uid()
    )
  );

CREATE POLICY "parents_insert" ON parents
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "parents_update" ON parents
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "parents_delete" ON parents
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- ATTENDANCE RECORDS
-- ============================================================
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Admin: full access. Teacher: read/write own classes. Parent: read own child.
CREATE POLICY "attendance_select" ON attendance_records
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
      OR (public.is_parent() AND student_id = public.get_parent_student_id())
    )
  );

CREATE POLICY "attendance_insert" ON attendance_records
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
    )
  );

CREATE POLICY "attendance_update" ON attendance_records
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
    )
  );

CREATE POLICY "attendance_delete" ON attendance_records
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- QURAN PROGRESS
-- ============================================================
ALTER TABLE quran_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quran_progress_select" ON quran_progress
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
      OR (public.is_parent() AND student_id = public.get_parent_student_id())
    )
  );

CREATE POLICY "quran_progress_insert" ON quran_progress
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
    )
  );

CREATE POLICY "quran_progress_update" ON quran_progress
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
    )
  );

CREATE POLICY "quran_progress_delete" ON quran_progress
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- FEE RECORDS
-- ============================================================
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fee_records_select" ON fee_records
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR (public.is_parent() AND student_id = public.get_parent_student_id())
    )
  );

CREATE POLICY "fee_records_insert" ON fee_records
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "fee_records_update" ON fee_records
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "fee_records_delete" ON fee_records
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- HOMEWORK
-- ============================================================
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

CREATE POLICY "homework_select" ON homework
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
      OR (public.is_parent() AND EXISTS (
        SELECT 1 FROM class_enrolments
        WHERE class_id = homework.class_id
        AND student_id = public.get_parent_student_id()
        AND left_at IS NULL
      ))
    )
  );

CREATE POLICY "homework_insert" ON homework
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
    )
  );

CREATE POLICY "homework_update" ON homework
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR public.is_teacher_of_class(class_id)
    )
  );

CREATE POLICY "homework_delete" ON homework
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- School-wide announcements (class_id IS NULL) visible to all in school.
-- Class-specific announcements visible to teacher of that class and enrolled parents.
CREATE POLICY "announcements_select" ON announcements
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR (public.get_user_role() = 'teacher' AND (
        class_id IS NULL
        OR public.is_teacher_of_class(class_id)
      ))
      OR (public.is_parent() AND (
        class_id IS NULL
        OR EXISTS (
          SELECT 1 FROM class_enrolments
          WHERE class_id = announcements.class_id
          AND student_id = public.get_parent_student_id()
          AND left_at IS NULL
        )
      ))
    )
  );

CREATE POLICY "announcements_insert" ON announcements
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR (public.get_user_role() = 'teacher' AND public.is_teacher_of_class(class_id))
    )
  );

CREATE POLICY "announcements_update" ON announcements
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "announcements_delete" ON announcements
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

-- ============================================================
-- REPORTS
-- ============================================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select" ON reports
  FOR SELECT USING (
    school_id = public.get_user_school_id()
    AND (
      public.get_user_role() = 'admin'
      OR (public.is_parent() AND student_id = public.get_parent_student_id())
    )
  );

CREATE POLICY "reports_insert" ON reports
  FOR INSERT WITH CHECK (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "reports_update" ON reports
  FOR UPDATE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );

CREATE POLICY "reports_delete" ON reports
  FOR DELETE USING (
    school_id = public.get_user_school_id()
    AND public.get_user_role() = 'admin'
  );
