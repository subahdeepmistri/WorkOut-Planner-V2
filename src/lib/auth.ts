import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getServerViewer() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.user.upsert({
    where: { authUserId: user.id },
    update: {
      email: user.email ?? "",
      displayName: user.user_metadata.full_name ?? user.user_metadata.name ?? null,
      avatarUrl: user.user_metadata.avatar_url ?? null
    },
    create: {
      authUserId: user.id,
      email: user.email ?? `${user.id}@pending.local`,
      displayName: user.user_metadata.full_name ?? user.user_metadata.name ?? null,
      avatarUrl: user.user_metadata.avatar_url ?? null
    }
  });

  return {
    auth: user,
    profile
  };
}

export async function requireServerViewer() {
  const viewer = await getServerViewer();

  if (!viewer) {
    redirect("/sign-in");
  }

  return viewer;
}
