import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type MutationResult = { success: true } | { success: false; error: string; fieldErrors?: Record<string, string> };

export function validationFailure(error: z.ZodError): MutationResult {
  const fieldErrors = Object.fromEntries(error.issues.map((issue) => [issue.path.join("."), issue.message]));
  return { success: false, error: "Thông tin chưa hợp lệ. Vui lòng kiểm tra các trường nhập liệu.", fieldErrors };
}

export async function runMutation(work: () => Promise<unknown>): Promise<MutationResult> {
  try { await work(); return { success: true }; }
  catch (error) {
    console.error("Admin mutation failed", error);
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "23505") return { success: false, error: "Slug hoặc mã bản ghi đã tồn tại. Hãy dùng giá trị khác.", fieldErrors: { slug: "Slug hoặc mã đã được sử dụng." } };
    if (code === "23503") return { success: false, error: "Bản ghi đang được sử dụng. Không thể xóa hoặc tham chiếu bản ghi không tồn tại." };
    if (code === "PGRST116" || code === "P0002") return { success: false, error: "Bản ghi không còn tồn tại. Hãy tải lại trang." };
    if (error instanceof Error && error.message.includes("JWT")) {
      return { success: false, error: "Phiên quản trị hết hạn. Vui lòng đăng nhập lại." };
    }
    return { success: false, error: "Không thể lưu thay đổi. Kiểm tra kết nối và migration database rồi thử lại." };
  }
}

export async function saveContent(kind: "service" | "doctor" | "article" | "slider" | "site-content" | "service-detail" | "contact-cta", data: unknown, title: string, snapshot: unknown = data): Promise<{ id: string; slug?: string }> {
  const supabase = await getSupabaseServerClient();
  const { data: saved, error } = await supabase.rpc("admin_save_content", {
    p_kind: kind, p_data: JSON.parse(JSON.stringify(data)), p_title: title,
    p_snapshot: JSON.parse(JSON.stringify(snapshot)),
  });
  if (error) throw error;
  return saved;
}
