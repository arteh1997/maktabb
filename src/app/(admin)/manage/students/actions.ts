"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";
import type { InsertTables, UpdateTables } from "@/lib/types/database";

export async function getStudents(search?: string) {
  await requireRole("admin");
  const supabase = createClient();

  let query = supabase
    .from("students")
    .select(
      "*, parents(id, name, email, phone), class_enrolments(class_id, classes(name))"
    )
    .is("archived_at", null)
    .order("name");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) return { error: error.message, students: [] };
  return { students: data ?? [] };
}

export async function getClassesForDropdown() {
  await requireRole("admin");
  const supabase = createClient();

  const { data } = await supabase
    .from("classes")
    .select("id, name, year_group")
    .is("archived_at", null)
    .order("name");

  return data ?? [];
}

export async function createStudent(formData: FormData) {
  const user = await requireRole("admin");
  const supabase = createClient();

  // Create student
  const studentData: InsertTables<"students"> = {
    school_id: user.schoolId,
    name: formData.get("name") as string,
    date_of_birth: (formData.get("dateOfBirth") as string) || null,
    gender: (formData.get("gender") as "male" | "female") || null,
  };

  const { data: studentRow, error: studentError } = await supabase
    .from("students")
    .insert(studentData as never)
    .select("id")
    .single<{ id: string }>();

  if (studentError || !studentRow) {
    return { error: studentError?.message ?? "Failed to create student" };
  }

  const studentId = studentRow.id;

  // Create parent/guardian
  const parentName = formData.get("parentName") as string;
  if (parentName) {
    const consentGiven = formData.get("consent") === "on";
    const parentData: InsertTables<"parents"> = {
      student_id: studentId,
      school_id: user.schoolId,
      name: parentName,
      email: (formData.get("parentEmail") as string) || null,
      phone: (formData.get("parentPhone") as string) || null,
      consent_given_at: consentGiven ? new Date().toISOString() : null,
    };

    const { error: parentError } = await supabase
      .from("parents")
      .insert(parentData as never);

    if (parentError) {
      return { error: parentError.message };
    }
  }

  // Enrol in class if selected
  const classId = formData.get("classId") as string;
  if (classId) {
    const { error: enrolError } = await supabase
      .from("class_enrolments")
      .insert({ student_id: studentId, class_id: classId } as never);

    if (enrolError) {
      return { error: enrolError.message };
    }
  }

  revalidatePath("/manage/students");
  return { success: true };
}

export async function updateStudent(studentId: string, formData: FormData) {
  await requireRole("admin");
  const supabase = createClient();

  const updateData: UpdateTables<"students"> = {
    name: formData.get("name") as string,
    date_of_birth: (formData.get("dateOfBirth") as string) || null,
    gender: (formData.get("gender") as "male" | "female") || null,
  };

  const { error } = await supabase
    .from("students")
    .update(updateData as never)
    .eq("id", studentId);

  if (error) return { error: error.message };

  // Update parent if provided
  const parentId = formData.get("parentId") as string;
  const parentName = formData.get("parentName") as string;
  if (parentId && parentName) {
    const parentUpdate: UpdateTables<"parents"> = {
      name: parentName,
      email: (formData.get("parentEmail") as string) || null,
      phone: (formData.get("parentPhone") as string) || null,
    };

    await supabase
      .from("parents")
      .update(parentUpdate as never)
      .eq("id", parentId);
  }

  revalidatePath("/manage/students");
  return { success: true };
}

export async function archiveStudent(studentId: string) {
  await requireRole("admin");
  const supabase = createClient();

  const { error } = await supabase
    .from("students")
    .update({ archived_at: new Date().toISOString() } as never)
    .eq("id", studentId);

  if (error) return { error: error.message };

  revalidatePath("/manage/students");
  return { success: true };
}
