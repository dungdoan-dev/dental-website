import { db } from "@/lib/db";
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
  const clinic = await db.clinic.findUnique({ where: { id: appointment.clinicId }, select: { id: true } });
  if (!clinic) {
    throw new InvalidAppointmentClinicError();
  }
  const shift = appointmentShifts.find((item) => item.id === appointment.preferredShift);
  const note = [shift ? `Ca mong muốn: ${shift.label} (${shift.hours})` : null, appointment.note]
    .filter(Boolean)
    .join("\n") || undefined;

  await db.appointment.create({
    data: {
      name: appointment.name,
      phone: appointment.phone,
      email: appointment.email,
      serviceId: appointment.serviceId,
      doctorId: appointment.doctorId,
      clinicId: appointment.clinicId,
      appointmentDate: new Date(appointment.appointmentDate),
      note,
      status: "pending",
    },
  });

  await sendAppointmentNotification(appointment);
  return { success: true, message: "Đặt lịch thành công" };
}
