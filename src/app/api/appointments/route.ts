import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createAppointment } from "@/features/appointments/services/appointment.service";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const result = await createAppointment(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ success: false, message: "Dữ liệu JSON không hợp lệ" }, { status: 400 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, message: "Dữ liệu đặt lịch không hợp lệ", errors: error.flatten().fieldErrors }, { status: 422 });
    }
    console.error("Appointment API error", error);
    return NextResponse.json({ success: false, message: "Không thể xử lý yêu cầu lúc này" }, { status: 500 });
  }
}
