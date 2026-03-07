import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "admin":
      redirect("/dashboard");
    case "teacher":
      redirect("/classes");
    case "parent":
      redirect("/child");
    default:
      redirect("/login");
  }
}
