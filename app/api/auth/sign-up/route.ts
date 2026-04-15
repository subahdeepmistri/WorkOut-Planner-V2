import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/http";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request payload.");
  }

  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Enter a valid email and a password with at least 8 characters.");
  }

  const supabase = await createSupabaseServerClient();
  const origin = new URL(request.url).origin;

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    const normalized = error.message.toLowerCase();

    if (normalized.includes("rate limit")) {
      return fail(
        "Too many confirmation emails were sent. Wait a minute and try again, or sign in if the account already exists.",
        429
      );
    }

    return fail(error.message, 400);
  }

  return ok({
    userId: data.user?.id ?? null,
    needsEmailConfirmation: !data.session
  });
}
