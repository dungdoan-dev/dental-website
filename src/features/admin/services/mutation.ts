import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type MutationResult = { success: true } | { success: false; error: string; fieldErrors?: Record<string, string> };

export class SlugConflictError extends Error {}

export function validationFailure(error: z.ZodError): MutationResult {
  const fieldErrors = Object.fromEntries(error.issues.map((issue) => [issue.path.join("."), issue.message]));
  return { success: false, error: "Thông tin chưa hợp lệ. Vui lòng kiểm tra các trường nhập liệu.", fieldErrors };
}

export async function runMutation(work: () => Promise<unknown>): Promise<MutationResult> {
  try { await work(); return { success: true }; }
  catch (error) {
    if (error instanceof SlugConflictError) return { success: false, error: "Slug này đã được sử dụng bởi bản ghi khác.", fieldErrors: { slug: "Slug đã tồn tại." } };
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code === "23505") return { success: false, error: "Slug hoặc mã bản ghi đã tồn tại. Hãy dùng giá trị khác.", fieldErrors: { slug: "Slug hoặc mã đã được sử dụng." } };
    if (code === "23503") return { success: false, error: "Bản ghi đang được sử dụng. Không thể xóa hoặc tham chiếu bản ghi không tồn tại." };
    if (code === "PGRST116") return { success: false, error: "Bản ghi không còn tồn tại. Hãy tải lại trang." };
    if (error instanceof Error && error.message.includes("JWT")) {
      return { success: false, error: "Phiên quản trị hết hạn. Vui lòng đăng nhập lại." };
    }
    return { success: false, error: "Không thể lưu thay đổi. Kiểm tra kết nối và migration database rồi thử lại." };
  }
}

export async function saveRevision(kind: string, entityId: string, title: string, snapshot: unknown) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const { error } = await supabase.from("admin_content_revisions").insert({
    kind,
    entity_id: entityId,
    title,
    snapshot: JSON.parse(JSON.stringify(snapshot)),
    actor: typeof claims?.email === "string" ? claims.email : "admin",
  });
  if (error) throw error;
}
