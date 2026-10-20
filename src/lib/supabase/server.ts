import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Set ADMIN_PERF=1 to log every Supabase request with its duration in the server console (find slow admin pages).
const timedFetch: typeof fetch = async (input, init) => {
  const started = performance.now();
  try {
    return await fetch(input, init);
  } finally {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    console.log(`[perf] ${init?.method ?? "GET"} ${url.pathname}${url.search.slice(0, 60)} ${Math.round(performance.now() - started)}ms`);
  }
};

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public API is not configured.");

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    global: process.env.ADMIN_PERF ? { fetch: timedFetch } : undefined,
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components cannot write cookies; auth actions can refresh them.
        }
      },
    },
  });
}
