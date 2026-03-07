"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSchoolDetails, createFirstClass, inviteTeacher } from "./actions";

const MEETING_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  async function handleSchoolDetails(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await updateSchoolDetails(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    setStep(2);
  }

  async function handleCreateClass(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createFirstClass(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    setStep(3);
  }

  async function handleInviteTeacher(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await inviteTeacher(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setLoading(false);
    setStep(4);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Step 1: School Details */}
        {step === 1 && (
          <form action={handleSchoolDetails} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                School details
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us about your maktab
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName">School name</Label>
              <Input
                id="schoolName"
                name="schoolName"
                required
                placeholder="Al-Noor Maktab"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Mosque Road, London"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                name="postcode"
                placeholder="E1 1AA"
                pattern="[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}"
                title="Enter a valid UK postcode"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Next"}
            </Button>
          </form>
        )}

        {/* Step 2: First Class */}
        {step === 2 && (
          <form action={handleCreateClass} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Create your first class
              </h2>
              <p className="text-sm text-muted-foreground">
                You can add more classes later
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="className">Class name</Label>
              <Input
                id="className"
                name="className"
                required
                placeholder="Quran Hifz - Year 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearGroup">Year group</Label>
              <Input
                id="yearGroup"
                name="yearGroup"
                placeholder="Year 3"
              />
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
                      className="rounded border-input"
                    />
                    <span className="capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creating..." : "Next"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Invite Teacher */}
        {step === 3 && (
          <form action={handleInviteTeacher} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Invite a teacher
              </h2>
              <p className="text-sm text-muted-foreground">
                Optional — you can skip this and invite teachers later
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Teacher&apos;s email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="teacher@email.com"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setStep(4)}
              >
                Skip
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Sending..." : "Invite"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
              <svg
                className="h-8 w-8 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                You&apos;re all set!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your maktab is ready to go. Start by adding students to your
                class.
              </p>
            </div>
            <Button asChild className="w-full">
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
