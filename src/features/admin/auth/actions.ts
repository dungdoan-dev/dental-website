"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { clearLoginAttempts, reserveLoginAttempt } from "./login-limit";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from "./admin-auth";

export type LoginState = { error: string };

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(1024),
});

export async function loginAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminAuthConfigured()) return { error: "Đăng nhập admin chưa được cấu hình trên máy chủ." };

  try {
    if (!(await reserveLoginAttempt())) return { error: "Đã thử đăng nhập quá nhiều lần. Vui lòng chờ tối đa 15 phút rồi thử lại." };
  } catch {
    return { error: "Không thể kiểm tra đăng nhập. Vui lòng kiểm tra kết nối database và migration admin." };
  }

  const credentials = credentialsSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!credentials.success || !verifyAdminCredentials(credentials.data.username, credentials.data.password)) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  try {
    await clearLoginAttempts();
    await createAdminSession();
  } catch {
    return { error: "Không thể tạo phiên đăng nhập. Vui lòng thử lại." };
  }
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
