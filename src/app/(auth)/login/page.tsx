"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { login, sendMagicLink } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"staff" | "parent">("staff");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleStaffLogin(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleParentLogin(formData: FormData) {
    setLoading(true);
    setError(null);
    const email = formData.get("email") as string;
    const result = await sendMagicLink(email);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("Check your email for a login link.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Maktabb</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg border bg-muted p-1">
          <button
            type="button"
            onClick={() => {
              setMode("staff");
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "staff"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("parent");
              setError(null);
              setMessage(null);
            }}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "parent"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Parent
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-700">
            {message}
          </div>
        )}

        {mode === "staff" ? (
          <form action={handleStaffLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="you@school.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        ) : (
          <form action={handleParentLogin} className="space-y-4">
            <div>
              <label
                htmlFor="parent-email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="parent-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="parent@email.com"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We&apos;ll send you a magic link to sign in. No password needed.
            </p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending link..." : "Send magic link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
