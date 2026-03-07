"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import type { InsertTables, UpdateTables } from "@/lib/types/database";

export async function getClasses() {
  await requireRole("admin");
  const supabase = createClient();

  const { data, error } = await supabase
    .from("classes")
    .select("*, teachers(name), class_enrolments(count)")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, classes: [] };
  return { classes: data ?? [] };
}

export async function getTeachers() {
  await requireRole("admin");
  const supabase = createClient();

  const { data } = await supabase
    .from("teachers")
    .select("id, name, email")
    .eq("is_active", true)
    .order("name");

  return data ?? [];
}

export async function createClass(formData: FormData) {
  const user = await requireRole("admin");
  const supabase = createClient();

  const meetingDays = formData.getAll("meetingDays") as string[];

  const classData: InsertTables<"classes"> = {
    school_id: user.schoolId,
    name: formData.get("name") as string,
    year_group: (formData.get("yearGroup") as string) || null,
    meeting_days: meetingDays.length > 0 ? meetingDays : null,
    academic_year: formData.get("academicYear") as string,
    teacher_id: (formData.get("teacherId") as string) || null,
  };

  const { error } = await supabase
    .from("classes")
    .insert(classData as never);

  if (error) return { error: error.message };

  revalidatePath("/manage/classes");
  return { success: true };
}

export async function updateClass(classId: string, formData: FormData) {
  await requireRole("admin");
  const supabase = createClient();

  const meetingDays = formData.getAll("meetingDays") as string[];

  const updateData: UpdateTables<"classes"> = {
    name: formData.get("name") as string,
    year_group: (formData.get("yearGroup") as string) || null,
    meeting_days: meetingDays.length > 0 ? meetingDays : null,
    academic_year: formData.get("academicYear") as string,
    teacher_id: (formData.get("teacherId") as string) || null,
  };

  const { error } = await supabase
    .from("classes")
    .update(updateData as never)
    .eq("id", classId);

  if (error) return { error: error.message };

  revalidatePath("/manage/classes");
  return { success: true };
}

export async function archiveClass(classId: string) {
  await requireRole("admin");
  const supabase = createClient();

  const { error } = await supabase
    .from("classes")
    .update({ archived_at: new Date().toISOString() } as never)
    .eq("id", classId);

  if (error) return { error: error.message };

  revalidatePath("/manage/classes");
  return { success: true };
}
