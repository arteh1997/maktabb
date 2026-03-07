import { getStudents, getClassesForDropdown } from "./actions";
import { StudentsClient } from "./students-client";

export default async function StudentsPage() {
  const [{ students }, classes] = await Promise.all([
    getStudents(),
    getClassesForDropdown(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <StudentsClient initialStudents={students} classes={classes} />
    </div>
  );
}
