import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/http";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request payload.");
  }

  const parsed = signInSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Enter a valid email and password.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    return fail(error.message, 400);
  }

  return ok({
    userId: data.user?.id ?? null,
    signedIn: Boolean(data.session)
  });
}
