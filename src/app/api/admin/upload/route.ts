import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasAdminSession } from "@/features/admin/auth/admin-auth";

export const runtime = "nodejs";

const maxBytes = 8 * 1024 * 1024;
const mimeToExtension = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Vui lòng đăng nhập quản trị." }, { status: 401 });

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Nguồn gửi yêu cầu không hợp lệ." }, { status: 403 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBytes + 64 * 1024) return NextResponse.json({ error: "Ảnh vượt quá giới hạn 8 MB." }, { status: 413 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Không tìm thấy tệp ảnh." }, { status: 400 });
  if (file.size === 0 || file.size > maxBytes) return NextResponse.json({ error: "Ảnh phải có dung lượng từ 1 byte đến 8 MB." }, { status: 413 });

  const extension = mimeToExtension.get(file.type);
  if (!extension) return NextResponse.json({ error: "Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP." }, { status: 415 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  if (!(isJpeg || isPng || isWebp)) return NextResponse.json({ error: "Định dạng nội dung ảnh không hợp lệ." }, { status: 415 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return NextResponse.json({ error: "Thiếu cấu hình Supabase Storage phía máy chủ." }, { status: 503 });

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const path = `admin/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("site-media").upload(path, buffer, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("Supabase image upload failed:", error.message);
    return NextResponse.json({ error: "Không thể tải ảnh lên kho lưu trữ. Vui lòng thử lại." }, { status: 502 });
  }

  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return NextResponse.json({ path: data.publicUrl });
}
