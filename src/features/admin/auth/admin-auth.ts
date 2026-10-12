import "server-only";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export function isAdminUser(user: { app_metadata?: Record<string, unknown> } | null | undefined) {
  return user?.app_metadata?.role === "admin";
}

export async function hasAdminSession(): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return !error && isAdminUser(user);
}

export async function requireAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || !isAdminUser(user)) redirect("/admin/login");
  return user;
}

export async function clearAdminSession() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}
