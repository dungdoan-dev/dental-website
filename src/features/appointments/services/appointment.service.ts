import { getPublicSupabaseClient } from "@/lib/supabase/public";
import { sendAppointmentNotification } from "@/lib/mail";
import { appointmentShifts } from "../data/appointment-shifts";
import { appointmentSchema } from "../schemas/appointment.schema";
import type { AppointmentResult } from "../types/appointment.type";

export class InvalidAppointmentClinicError extends Error {
  constructor() {
    super("Cơ sở thăm khám không tồn tại hoặc đã ngừng hoạt động");
    this.name = "InvalidAppointmentClinicError";
  }
}

export async function createAppointment(input: unknown): Promise<AppointmentResult> {
  const appointment = appointmentSchema.parse(input);
  const supabase = getPublicSupabaseClient();
  const { data: clinic, error: clinicError } = await supabase.from("clinics").select("id").eq("id", appointment.clinicId).maybeSingle();
  if (clinicError) throw clinicError;
  if (!clinic) {
    throw new InvalidAppointmentClinicError();
  }
  const shift = appointmentShifts.find((item) => item.id === appointment.preferredShift);
  const note = [shift ? `Ca mong muốn: ${shift.label} (${shift.hours})` : null, appointment.note]
    .filter(Boolean)
    .join("\n") || undefined;

  const { error } = await supabase.from("appointments").insert({
      name: appointment.name,
      phone: appointment.phone,
      email: appointment.email || null,
      service_id: appointment.serviceId || null,
      doctor_id: appointment.doctorId || null,
      clinic_id: appointment.clinicId,
      appointment_date: new Date(appointment.appointmentDate).toISOString(),
      note,
      // status defaults to pending; anon may not set it (see 20261016 migration).
  });
  if (error) throw error;

  await sendAppointmentNotification(appointment);
  return { success: true, message: "Đặt lịch thành công" };
}
