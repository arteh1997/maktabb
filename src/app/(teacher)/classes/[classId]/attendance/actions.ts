"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/get-user";
import type { Enums } from "@/lib/types/database";

type EnrolmentRow = {
  student_id: string;
  students: { id: string; name: string } | null;
};

export async function getClassStudents(classId: string) {
  await requireRole("admin", "teacher");
  const supabase = createClient();

  const { data: classInfo } = await supabase
    .from("classes")
    .select("id, name")
    .eq("id", classId)
    .single<{ id: string; name: string }>();

  const { data: enrolments } = await supabase
    .from("class_enrolments")
    .select("student_id, students(id, name)")
    .eq("class_id", classId)
    .is("left_at", null)
    .returns<EnrolmentRow[]>();

  const students =
    enrolments
      ?.map((e) => e.students)
      .filter(Boolean)
      .sort((a, b) => (a!.name > b!.name ? 1 : -1)) ?? [];

  return { classInfo, students: students as { id: string; name: string }[] };
}

export async function getAttendanceForDate(classId: string, date: string) {
  await requireRole("admin", "teacher");
  const supabase = createClient();

  const { data } = await supabase
    .from("attendance_records")
    .select("id, student_id, status")
    .eq("class_id", classId)
    .eq("date", date)
    .returns<{ id: string; student_id: string; status: Enums<"attendance_status"> }[]>();

  return data ?? [];
}

export async function markAttendance(
  classId: string,
  studentId: string,
  date: string,
  status: Enums<"attendance_status">
) {
  const user = await requireRole("admin", "teacher");
  const supabase = createClient();

  // Validate no future dates
  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
    return { error: "Cannot mark attendance for future dates" };
  }

  // Check if record exists for this student+class+date
  const { data: existing } = await supabase
    .from("attendance_records")
    .select("id")
    .eq("student_id", studentId)
    .eq("class_id", classId)
    .eq("date", date)
    .single<{ id: string }>();

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from("attendance_records")
      .update({ status, marked_by: user.profileId } as never)
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    // Insert new record
    const { error } = await supabase.from("attendance_records").insert({
      student_id: studentId,
      class_id: classId,
      school_id: user.schoolId,
      date,
      status,
      marked_by: user.profileId,
    } as never);

    if (error) return { error: error.message };
  }

  return { success: true };
}

export async function markAllPresent(classId: string, date: string) {
  const user = await requireRole("admin", "teacher");
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
    return { error: "Cannot mark attendance for future dates" };
  }

  // Get all enrolled students
  const { data: enrolments } = await supabase
    .from("class_enrolments")
    .select("student_id")
    .eq("class_id", classId)
    .is("left_at", null)
    .returns<{ student_id: string }[]>();

  if (!enrolments || enrolments.length === 0) {
    return { error: "No students enrolled" };
  }

  // Get existing records for this date
  const { data: existing } = await supabase
    .from("attendance_records")
    .select("student_id")
    .eq("class_id", classId)
    .eq("date", date)
    .returns<{ student_id: string }[]>();

  const existingIds = new Set(existing?.map((e) => e.student_id) ?? []);

  // Insert records for students without existing records
  const newRecords = enrolments
    .filter((e) => !existingIds.has(e.student_id))
    .map((e) => ({
      student_id: e.student_id,
      class_id: classId,
      school_id: user.schoolId,
      date,
      status: "present" as const,
      marked_by: user.profileId,
    }));

  if (newRecords.length > 0) {
    const { error } = await supabase
      .from("attendance_records")
      .insert(newRecords as never[]);

    if (error) return { error: error.message };
  }

  // Update existing unmarked records to present
  if (existingIds.size > 0) {
    const { error } = await supabase
      .from("attendance_records")
      .update({ status: "present", marked_by: user.profileId } as never)
      .eq("class_id", classId)
      .eq("date", date);

    if (error) return { error: error.message };
  }

  return { success: true };
}
