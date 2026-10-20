import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { appointmentShifts } from "../data/appointment-shifts";
import { appointmentSchema } from "../schemas/appointment.schema";
import type { AppointmentResult } from "../types/appointment.type";

export class InvalidAppointmentClinicError extends Error {
  constructor() {
    super("Cơ sở thăm khám không tồn tại hoặc đã ngừng hoạt động");
    this.name = "InvalidAppointmentClinicError";
  }
}

export class AppointmentRateLimitError extends Error {}
export class AppointmentStorageUnavailableError extends Error {}
export class InvalidAppointmentReferenceError extends Error {}

export async function createAppointment(input: unknown, requestId: string, clientKey: string | null = null): Promise<AppointmentResult> {
  const appointment = appointmentSchema.parse(input);
  const supabase = getSupabaseServiceClient();
  const shift = appointmentShifts.find((item) => item.id === appointment.preferredShift);
  const note = [shift ? `Ca mong muốn: ${shift.label} (${shift.hours})` : null, appointment.note]
    .filter(Boolean)
    .join("\n") || undefined;

  const { data, error } = await supabase.rpc("submit_appointment", {
    p_data: { ...appointment, appointmentDate: new Date(appointment.appointmentDate).toISOString(), note }, p_request_id: requestId, p_client_key: clientKey,
  });
  if (error?.code === "P0002") throw new InvalidAppointmentClinicError();
  if (error?.code === "23503") throw new InvalidAppointmentReferenceError();
  if (error?.code === "P0001") throw new AppointmentRateLimitError();
  if (error?.code === "PGRST202") throw new AppointmentStorageUnavailableError();
  if (error) throw error;
  return { success: true, message: data.created ? "Đặt lịch thành công" : "Yêu cầu đặt lịch này đã được tiếp nhận." };
}
