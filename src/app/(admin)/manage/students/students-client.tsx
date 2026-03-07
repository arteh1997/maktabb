"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentFormDialog } from "./student-form-dialog";
import { archiveStudent, getStudents } from "./actions";
import { Plus, Pencil, Archive, Search } from "lucide-react";

type StudentRow = {
  id: string;
  name: string;
  date_of_birth: string | null;
  gender: "male" | "female" | null;
  parents: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  }[];
  class_enrolments: {
    class_id: string;
    classes: { name: string } | null;
  }[];
};

type ClassOption = {
  id: string;
  name: string;
  year_group: string | null;
};

export function StudentsClient({
  initialStudents,
  classes,
}: {
  initialStudents: StudentRow[];
  classes: ClassOption[];
}) {
  const [students, setStudents] = useState(initialStudents);
  const [createOpen, setCreateOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<StudentRow | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  async function handleSearch(query: string) {
    setSearchQuery(query);
    const result = await getStudents(query || undefined);
    setStudents(result.students as StudentRow[]);
  }

  async function handleArchive(studentId: string) {
    if (
      !confirm("Archive this student? All historical data will be preserved.")
    ) {
      return;
    }
    setArchiving(studentId);
    await archiveStudent(studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setArchiving(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">
            {students.length} student{students.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add student
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
          dir="auto"
        />
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "No students found" : "No students yet"}
          </p>
          {!searchQuery && (
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setCreateOpen(true)}
            >
              Add your first student
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                    Class
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                    Parent
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium lg:table-cell">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const parent = student.parents?.[0];
                  const enrolment = student.class_enrolments?.[0];
                  return (
                    <tr key={student.id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium" dir="auto">
                            {student.name}
                          </span>
                          {student.gender && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {student.gender === "male" ? "M" : "F"}
                            </span>
                          )}
                        </div>
                        {/* Mobile: show class below name */}
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {enrolment?.classes?.name ?? "No class"}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {enrolment?.classes?.name ?? "—"}
                      </td>
                      <td
                        className="hidden px-4 py-3 text-muted-foreground md:table-cell"
                        dir="auto"
                      >
                        {parent?.name ?? "—"}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                        {parent?.email ?? parent?.phone ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditStudent(student)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleArchive(student.id)}
                            disabled={archiving === student.id}
                            title="Archive"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <StudentFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        classes={classes}
      />

      {editStudent && (
        <StudentFormDialog
          open={!!editStudent}
          onOpenChange={(open) => {
            if (!open) setEditStudent(null);
          }}
          studentData={editStudent}
          classes={classes}
        />
      )}
    </div>
  );
}
