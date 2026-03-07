import { requireRole } from "@/lib/auth/get-user";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin", "teacher");
  return <>{children}</>;
}
