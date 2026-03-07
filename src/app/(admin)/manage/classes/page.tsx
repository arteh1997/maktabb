import { getClasses, getTeachers } from "./actions";
import { ClassesClient } from "./classes-client";

export default async function ClassesPage() {
  const [{ classes }, teachers] = await Promise.all([
    getClasses(),
    getTeachers(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <ClassesClient initialClasses={classes} teachers={teachers} />
    </div>
  );
}
