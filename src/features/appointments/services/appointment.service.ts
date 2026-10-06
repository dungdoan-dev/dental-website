import { sendAppointmentNotification } from "@/lib/mail";
import { appointmentSchema } from "../schemas/appointment.schema";
import type { AppointmentResult } from "../types/appointment.type";

export async function createAppointment(input: unknown): Promise<AppointmentResult> {
  const appointment = appointmentSchema.parse(input);
  await sendAppointmentNotification(appointment);
  return { success: true, message: "Đặt lịch thành công" };
}
