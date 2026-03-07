import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Tables } from "@/lib/types/database";

export type AppUser = {
  id: string;
  email: string;
  role: "admin" | "teacher" | "parent";
  schoolId: string;
  profileId: string;
  name: string;
};

type TeacherRow = Pick<Tables<"teachers">, "id" | "school_id" | "name" | "role">;
type ParentRow = Pick<Tables<"parents">, "id" | "school_id" | "name">;

export async function getUser(): Promise<AppUser | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Check if user is a teacher/admin
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, school_id, name, role")
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .maybeSingle<TeacherRow>();

  if (teacher) {
    return {
      id: user.id,
      email: user.email!,
      role: teacher.role,
      schoolId: teacher.school_id,
      profileId: teacher.id,
      name: teacher.name,
    };
  }

  // Check if user is a parent
  const { data: parent } = await supabase
    .from("parents")
    .select("id, school_id, name")
    .eq("auth_user_id", user.id)
    .maybeSingle<ParentRow>();

  if (parent) {
    return {
      id: user.id,
      email: user.email!,
      role: "parent",
      schoolId: parent.school_id,
      profileId: parent.id,
      name: parent.name,
    };
  }

  return null;
}

export async function requireAuth(): Promise<AppUser> {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(
  ...allowedRoles: AppUser["role"][]
): Promise<AppUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}
