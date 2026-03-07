"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/get-user";

type ClassRow = {
  id: string;
  name: string;
  year_group: string | null;
  meeting_days: string[] | null;
  class_enrolments: { count: number }[];
};

export async function getTeacherClasses() {
  const user = await requireRole("admin", "teacher");
  const supabase = createClient();

  const { data } = await supabase
    .from("classes")
    .select("id, name, year_group, meeting_days, class_enrolments(count)")
    .eq("teacher_id", user.profileId)
    .is("archived_at", null)
    .order("name")
    .returns<ClassRow[]>();

  return (
    data?.map((cls) => ({
      id: cls.id,
      name: cls.name,
      year_group: cls.year_group,
      meeting_days: cls.meeting_days,
      student_count: cls.class_enrolments?.[0]?.count ?? 0,
    })) ?? []
  );
}
