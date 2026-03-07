"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTeacherClasses } from "./actions";
import { ClipboardList } from "lucide-react";

type ClassRow = {
  id: string;
  name: string;
  year_group: string | null;
  meeting_days: string[] | null;
  student_count: number;
};

export default function TeacherClasses() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherClasses().then((data) => {
      setClasses(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">My Classes</h1>

      {classes.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No classes assigned to you yet
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div>
                <h2 className="font-medium">{cls.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {cls.year_group ?? "No year group"} &middot;{" "}
                  {cls.student_count} student
                  {cls.student_count !== 1 ? "s" : ""}
                  {cls.meeting_days && cls.meeting_days.length > 0 && (
                    <>
                      {" "}
                      &middot;{" "}
                      {cls.meeting_days.map((d) => d.slice(0, 3)).join(", ")}
                    </>
                  )}
                </p>
              </div>
              <Button asChild size="sm">
                <a href={`/classes/${cls.id}/attendance`}>
                  <ClipboardList className="mr-1.5 h-4 w-4" />
                  Attendance
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
