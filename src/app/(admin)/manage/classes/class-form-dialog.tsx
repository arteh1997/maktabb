"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClass, updateClass } from "./actions";

const MEETING_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type ClassData = {
  id: string;
  name: string;
  year_group: string | null;
  meeting_days: string[] | null;
  academic_year: string;
  teacher_id: string | null;
};

type Teacher = {
  id: string;
  name: string;
  email: string;
};

export function ClassFormDialog({
  open,
  onOpenChange,
  classData,
  teachers,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: ClassData;
  teachers: Teacher[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!classData;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = isEditing
      ? await updateClass(classData!.id, formData)
      : await createClass(formData);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
    }
  }

  // Current academic year
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const defaultAcademicYear =
    month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit class" : "Create class"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the class details below."
              : "Add a new class to your school."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={classData?.name}
              placeholder="Quran Hifz - Year 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearGroup">Year group</Label>
            <Input
              id="yearGroup"
              name="yearGroup"
              defaultValue={classData?.year_group ?? ""}
              placeholder="Year 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic year</Label>
            <Input
              id="academicYear"
              name="academicYear"
              required
              defaultValue={classData?.academic_year ?? defaultAcademicYear}
              placeholder="2025-2026"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Assigned teacher</Label>
            <select
              id="teacherId"
              name="teacherId"
              defaultValue={classData?.teacher_id ?? ""}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Unassigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Meeting days</Label>
            <div className="grid grid-cols-2 gap-2">
              {MEETING_DAYS.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="meetingDays"
                    value={day}
                    defaultChecked={classData?.meeting_days?.includes(day)}
                    className="rounded border-input"
                  />
                  <span className="capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
