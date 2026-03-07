"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getClassStudents,
  getAttendanceForDate,
  markAttendance,
  markAllPresent,
} from "./actions";
import { ChevronLeft, CheckCircle } from "lucide-react";
import type { Enums } from "@/lib/types/database";

type AttendanceStatus = Enums<"attendance_status">;

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; short: string; color: string; activeColor: string }
> = {
  present: {
    label: "Present",
    short: "P",
    color: "border-green-200 text-green-700",
    activeColor: "bg-green-500 text-white border-green-500",
  },
  absent: {
    label: "Absent",
    short: "A",
    color: "border-red-200 text-red-700",
    activeColor: "bg-red-500 text-white border-red-500",
  },
  late: {
    label: "Late",
    short: "L",
    color: "border-amber-200 text-amber-700",
    activeColor: "bg-amber-500 text-white border-amber-500",
  },
  excused: {
    label: "Excused",
    short: "E",
    color: "border-blue-200 text-blue-700",
    activeColor: "bg-blue-500 text-white border-blue-500",
  },
};

export default function AttendancePage({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [classData, records] = await Promise.all([
      getClassStudents(classId),
      getAttendanceForDate(classId, date),
    ]);

    setClassName(classData.classInfo?.name ?? "");
    setStudents(classData.students);

    const attendanceMap: Record<string, AttendanceStatus> = {};
    for (const record of records) {
      attendanceMap[record.student_id] = record.status;
    }
    setAttendance(attendanceMap);
    setLoading(false);
  }, [classId, date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleMark(studentId: string, status: AttendanceStatus) {
    // Optimistic update
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    setSaving(studentId);

    const result = await markAttendance(classId, studentId, date, status);
    if (result?.error) {
      // Revert on error
      setAttendance((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }
    setSaving(null);
  }

  async function handleMarkAllPresent() {
    // Optimistic update
    const newAttendance: Record<string, AttendanceStatus> = { ...attendance };
    for (const student of students) {
      if (!newAttendance[student.id]) {
        newAttendance[student.id] = "present";
      }
    }
    setAttendance(newAttendance);

    const result = await markAllPresent(classId, date);
    if (result?.error) {
      loadData(); // Reload on error
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const markedCount = Object.keys(attendance).length;
  const totalCount = students.length;

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <a href="/classes" className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </a>
        <div className="flex-1">
          <h1 className="text-lg font-semibold" dir="auto">
            {className || "Attendance"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {markedCount}/{totalCount} marked
          </p>
        </div>
      </div>

      {/* Date picker + Mark All */}
      <div className="mb-4 flex items-center gap-2">
        <Input
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          className="w-auto text-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllPresent}
          disabled={markedCount === totalCount}
        >
          <CheckCircle className="mr-1.5 h-4 w-4" />
          All Present
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      ) : students.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No students enrolled in this class
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((student) => {
            const status = attendance[student.id];
            return (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
              >
                <span
                  className="flex-1 text-sm font-medium"
                  dir="auto"
                >
                  {student.name}
                </span>
                <div className="flex gap-1">
                  {(
                    Object.keys(STATUS_CONFIG) as AttendanceStatus[]
                  ).map((s) => {
                    const config = STATUS_CONFIG[s];
                    const isActive = status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleMark(student.id, s)}
                        disabled={saving === student.id}
                        className={`h-8 w-8 rounded-md border text-xs font-bold transition-colors ${
                          isActive ? config.activeColor : config.color
                        } ${!isActive ? "hover:bg-muted" : ""}`}
                        title={config.label}
                      >
                        {config.short}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
