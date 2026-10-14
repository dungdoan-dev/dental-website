import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export function isAdminUser(user: { app_metadata?: Record<string, unknown> } | null | undefined) {
  return user?.app_metadata?.role === "admin";
}

export async function hasAdminSession(): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  return !error && isAdminUser(claims);
}

export const requireAdmin = cache(async () => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims || !isAdminUser(claims)) redirect("/admin/login");
  return claims;
});

export async function clearAdminSession() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}
