import { Prisma } from "@prisma/client";
import { z } from "zod";

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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return { success: false, error: "Slug hoặc mã bản ghi đã tồn tại. Hãy dùng giá trị khác.", fieldErrors: { slug: "Slug hoặc mã đã được sử dụng." } };
      if (error.code === "P2003") return { success: false, error: "Bản ghi đang được sử dụng. Không thể xóa hoặc tham chiếu bản ghi không tồn tại." };
      if (error.code === "P2025") return { success: false, error: "Bản ghi không còn tồn tại. Hãy tải lại trang." };
    }
    return { success: false, error: "Không thể lưu thay đổi. Kiểm tra kết nối và migration database rồi thử lại." };
  }
}

export async function saveRevision(tx: Prisma.TransactionClient, kind: string, entityId: string, title: string, snapshot: unknown) {
  await tx.adminContentRevision.create({ data: {
    kind, entityId, title, snapshot: JSON.parse(JSON.stringify(snapshot)) as Prisma.InputJsonValue,
    actor: process.env.ADMIN_USERNAME?.trim() || "admin",
  } });
}
