"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "./admin-auth";

export type LoginState = { error: string };

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(1024),
});

export async function loginAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  const credentials = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!credentials.success) return { error: "Vui lòng nhập email và mật khẩu hợp lệ." };

  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword(credentials.data);
    if (error || !data.user) return { error: "Email hoặc mật khẩu không đúng." };
    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut();
      return { error: "Tài khoản chưa được cấp quyền quản trị." };
    }
  } catch {
    return { error: "Không thể kết nối Supabase Auth. Vui lòng thử lại sau." };
  }

  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
