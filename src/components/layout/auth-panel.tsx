"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthPanelProps {
  mode: "sign-in" | "sign-up";
}

export function AuthPanel({ mode }: AuthPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ email: string; password: string } | null>(null);

  const isSignIn = mode === "sign-in";

  function toFriendlyError(rawError?: string) {
    if (!rawError) {
      return "Authentication failed.";
    }

    const normalized = rawError.toLowerCase();

    if (normalized.includes("rate limit")) {
      return "Too many confirmation emails were sent. Wait a minute, then try again, or sign in if your account was already created.";
    }

    if (normalized.includes("invalid login credentials")) {
      return "Incorrect email or password.";
    }

    if (normalized.includes("email not confirmed")) {
      return "Check your inbox and confirm your email before signing in.";
    }

    return rawError;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError(null);
    setMessage(null);
    setSubmitted({
      email,
      password
    });
    setLoading(true);

    try {
      const response = await fetch(isSignIn ? "/api/auth/sign-in" : "/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = (await response.json()) as {
        data?: { needsEmailConfirmation?: boolean };
        error?: string;
      };

      if (!response.ok || result.error) {
        setError(toFriendlyError(result.error));
        return;
      }

      if (!isSignIn && result.data?.needsEmailConfirmation) {
        setMessage("Account created. Please check your email to confirm your account.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError(
        "Unable to reach auth service. Check your internet connection and Supabase keys in .env.local."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isSignIn ? "Welcome back" : "Create your account"}</CardTitle>
        <CardDescription>
          {isSignIn
            ? "Track your workout sessions with real-time progression data."
            : "Start your premium workout tracking journey."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
          {message ? <p className="text-sm font-medium text-success">{message}</p> : null}
          {submitted ? (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-foreground/85">
              <p>Submitted Email: {submitted.email}</p>
              <p>Submitted Password: {submitted.password}</p>
            </div>
          ) : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSignIn ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-foreground/70">
          {isSignIn ? "New to PulseForge? " : "Already have an account? "}
          <Link className="font-semibold text-primary" href={isSignIn ? "/sign-up" : "/sign-in"}>
            {isSignIn ? "Create account" : "Sign in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
