import { createClient } from "@/lib/supabase/server";
import type { AppUser } from "./get-user";

export async function canAccessStudent(
  user: AppUser,
  studentId: string
): Promise<boolean> {
  if (user.role === "admin") {
    // Admin can access any student in their school (RLS handles school isolation)
    const supabase = createClient();
    const { data } = await supabase
      .from("students")
      .select("id")
      .eq("id", studentId)
      .maybeSingle();
    return !!data;
  }

  if (user.role === "teacher") {
    // Teacher can access students enrolled in their classes
    const supabase = createClient();
    const { data } = await supabase
      .from("class_enrolments")
      .select("id, classes!inner(teacher_id)")
      .eq("student_id", studentId)
      .eq("classes.teacher_id", user.profileId)
      .is("left_at", null)
      .limit(1);
    return !!data && data.length > 0;
  }

  if (user.role === "parent") {
    // Parent can only access their linked child
    const supabase = createClient();
    const { data } = await supabase
      .from("parents")
      .select("student_id")
      .eq("auth_user_id", user.id)
      .eq("student_id", studentId)
      .maybeSingle();
    return !!data;
  }

  return false;
}

export async function canAccessClass(
  user: AppUser,
  classId: string
): Promise<boolean> {
  if (user.role === "admin") {
    // Admin can access any class in their school (RLS handles school isolation)
    const supabase = createClient();
    const { data } = await supabase
      .from("classes")
      .select("id")
      .eq("id", classId)
      .maybeSingle();
    return !!data;
  }

  if (user.role === "teacher") {
    // Teacher can only access their assigned classes
    const supabase = createClient();
    const { data } = await supabase
      .from("classes")
      .select("id")
      .eq("id", classId)
      .eq("teacher_id", user.profileId)
      .maybeSingle();
    return !!data;
  }

  if (user.role === "parent") {
    // Parent can access classes their child is enrolled in
    const supabase = createClient();
    const { data } = await supabase
      .from("class_enrolments")
      .select("id, parents!inner(auth_user_id)")
      .eq("class_id", classId)
      .eq("parents.auth_user_id", user.id)
      .is("left_at", null)
      .limit(1);
    return !!data && data.length > 0;
  }

  return false;
}
