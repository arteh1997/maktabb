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
import { createStudent, updateStudent } from "./actions";

type StudentData = {
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
};

type ClassOption = {
  id: string;
  name: string;
  year_group: string | null;
};

export function StudentFormDialog({
  open,
  onOpenChange,
  studentData,
  classes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentData?: StudentData;
  classes: ClassOption[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!studentData;
  const parent = studentData?.parents?.[0];

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    if (parent) {
      formData.set("parentId", parent.id);
    }

    const result = isEditing
      ? await updateStudent(studentData!.id, formData)
      : await createStudent(formData);

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit student" : "Add student"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update student and parent details."
              : "Add a new student with parent/guardian contact."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          {/* Student details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Student details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={studentData?.name}
                placeholder="Yusuf Ali"
                dir="auto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={studentData?.date_of_birth ?? ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={studentData?.gender ?? ""}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="classId">Assign to class</Label>
                <select
                  id="classId"
                  name="classId"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">No class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.year_group ? ` (${c.year_group})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Parent/Guardian details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Parent / Guardian
            </h3>

            <div className="space-y-2">
              <Label htmlFor="parentName">Name</Label>
              <Input
                id="parentName"
                name="parentName"
                required={!isEditing}
                defaultValue={parent?.name ?? ""}
                placeholder="Mr Ali"
                dir="auto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentEmail">Email</Label>
              <Input
                id="parentEmail"
                name="parentEmail"
                type="email"
                defaultValue={parent?.email ?? ""}
                placeholder="parent@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhone">Phone</Label>
              <Input
                id="parentPhone"
                name="parentPhone"
                type="tel"
                defaultValue={parent?.phone ?? ""}
                placeholder="+447700900000"
              />
            </div>

            {!isEditing && (
              <label className="flex items-start gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5 rounded border-input"
                />
                <span>
                  Parent/guardian consents to their child&apos;s data being
                  stored and processed by the school for educational purposes
                  (GDPR)
                </span>
              </label>
            )}
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
                  : "Adding..."
                : isEditing
                  ? "Save changes"
                  : "Add student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
