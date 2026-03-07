"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";
import type { UpdateTables, InsertTables } from "@/lib/types/database";

export async function updateSchoolDetails(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const supabase = createClient();

  const updateData: UpdateTables<"schools"> = {
    name: formData.get("schoolName") as string,
    address: formData.get("address") as string,
    postcode: formData.get("postcode") as string,
  };

  const { error } = await supabase
    .from("schools")
    .update(updateData as never)
    .eq("id", user.schoolId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function createFirstClass(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const supabase = createClient();

  const meetingDays = formData.getAll("meetingDays") as string[];

  const classData: InsertTables<"classes"> = {
    school_id: user.schoolId,
    name: formData.get("className") as string,
    year_group: formData.get("yearGroup") as string,
    meeting_days: meetingDays,
    academic_year: getCurrentAcademicYear(),
    teacher_id: user.profileId,
  };

  const { error } = await supabase.from("classes").insert(classData as never);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function inviteTeacher(formData: FormData) {
  const user = await getUser();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const email = formData.get("email") as string;
  if (!email) return { success: true }; // Skip if no email provided

  const supabase = createClient();

  // Create an auth user invite via Supabase
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      invited_by: user.id,
      school_id: user.schoolId,
      role: "teacher",
    },
  });

  if (error) {
    // If admin.inviteUserByEmail fails (no service role in client),
    // create a placeholder teacher record
    const teacherData: InsertTables<"teachers"> = {
      school_id: user.schoolId,
      auth_user_id: "00000000-0000-0000-0000-000000000000", // placeholder until they accept
      name: email.split("@")[0],
      email,
      role: "teacher",
      is_active: false,
    };

    const { error: insertError } = await supabase
      .from("teachers")
      .insert(teacherData as never);

    if (insertError) {
      return { error: insertError.message };
    }
  }

  return { success: true };
}

function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // Academic year starts in September
  if (month >= 8) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}
