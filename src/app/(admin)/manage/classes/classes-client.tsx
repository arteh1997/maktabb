"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClassFormDialog } from "./class-form-dialog";
import { archiveClass } from "./actions";
import { Plus, Pencil, Archive } from "lucide-react";

type ClassRow = {
  id: string;
  name: string;
  year_group: string | null;
  meeting_days: string[] | null;
  academic_year: string;
  teacher_id: string | null;
  teachers: { name: string } | null;
  class_enrolments: { count: number }[];
};

type Teacher = {
  id: string;
  name: string;
  email: string;
};

export function ClassesClient({
  initialClasses,
  teachers,
}: {
  initialClasses: ClassRow[];
  teachers: Teacher[];
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassRow | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);

  async function handleArchive(classId: string) {
    if (!confirm("Archive this class? Students and data will be preserved.")) {
      return;
    }
    setArchiving(classId);
    await archiveClass(classId);
    setArchiving(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-sm text-muted-foreground">
            Manage your school&apos;s classes
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New class
        </Button>
      </div>

      {initialClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-sm text-muted-foreground">No classes yet</p>
          <Button
            variant="link"
            className="mt-2"
            onClick={() => setCreateOpen(true)}
          >
            Create your first class
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Year group
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Teacher</th>
                  <th className="px-4 py-3 text-left font-medium">Students</th>
                  <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                    Days
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initialClasses.map((cls) => (
                  <tr key={cls.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{cls.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cls.year_group ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cls.teachers?.name ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cls.class_enrolments?.[0]?.count ?? 0}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {cls.meeting_days?.map((d) => d.slice(0, 3)).join(", ") ??
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditClass(cls)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleArchive(cls.id)}
                          disabled={archiving === cls.id}
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ClassFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        teachers={teachers}
      />

      {editClass && (
        <ClassFormDialog
          open={!!editClass}
          onOpenChange={(open) => {
            if (!open) setEditClass(null);
          }}
          classData={editClass}
          teachers={teachers}
        />
      )}
    </div>
  );
}
