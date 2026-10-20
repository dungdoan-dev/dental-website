import { after, NextResponse } from "next/server";
import { createHmac, randomUUID } from "node:crypto";
import { z, ZodError } from "zod";
import { createAppointment, InvalidAppointmentClinicError, InvalidAppointmentReferenceError, AppointmentRateLimitError, AppointmentStorageUnavailableError } from "@/features/appointments/services/appointment.service";
import { processAppointmentNotifications } from "@/features/appointments/services/notification.service";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/read-json-body";

export const maxDuration = 60;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ success: false, message: "Nguồn gửi yêu cầu không hợp lệ." }, { status: 403 });
    if (Number(request.headers.get("content-length") ?? 0) > 16384) return NextResponse.json({ success: false, message: "Dữ liệu gửi quá lớn." }, { status: 413 });
    const body = await readJsonBody(request);
    const meta = z.object({ requestId: z.uuid().optional(), website: z.string().max(500).optional() }).parse(body);
    if (meta.website) return NextResponse.json({ success: true, message: "Yêu cầu đã được tiếp nhận." }, { status: 202 });
    // Only trust IP headers when the hosting proxy is known to overwrite them.
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      : process.env.APPOINTMENT_TRUST_PROXY === "true" ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : null;
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const clientKey = ip && secret ? createHmac("sha256", secret).update(ip).digest("hex") : null;
    const result = await createAppointment(body, meta.requestId ?? randomUUID(), clientKey);
    after(async () => {
      try { await processAppointmentNotifications(); }
      catch { console.error("Appointment saved; notification queue needs attention"); }
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ success: false, message: "Dữ liệu gửi quá lớn." }, { status: 413 });
    if (error instanceof SyntaxError) {
      return NextResponse.json({ success: false, message: "Dữ liệu JSON không hợp lệ" }, { status: 400 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, message: error.issues[0]?.message ?? "Dữ liệu đặt lịch không hợp lệ", errors: error.flatten().fieldErrors }, { status: 422 });
    }
    if (error instanceof InvalidAppointmentClinicError) {
      return NextResponse.json({ success: false, message: error.message, errors: { clinicId: [error.message] } }, { status: 422 });
    }
    if (error instanceof AppointmentRateLimitError) return NextResponse.json({ success: false, message: "Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau hoặc gọi trực tiếp phòng khám." }, { status: 429, headers: { "Retry-After": "600" } });
    if (error instanceof InvalidAppointmentReferenceError) return NextResponse.json({ success: false, message: "Dịch vụ hoặc bác sĩ đã thay đổi. Vui lòng tải lại trang và chọn lại." }, { status: 422 });
    if (error instanceof AppointmentStorageUnavailableError) return NextResponse.json({ success: false, message: "Hệ thống đặt lịch đang được nâng cấp. Vui lòng gọi phòng khám để được hỗ trợ." }, { status: 503 });
    console.error("Appointment API error", error && typeof error === "object" && "code" in error ? String(error.code) : "unexpected");
    return NextResponse.json({ success: false, message: "Không thể xử lý yêu cầu lúc này" }, { status: 500 });
  }
}
