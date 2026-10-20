import type { AppointmentInput } from "@/features/appointments/types/appointment.type";

export function appointmentEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.APPOINTMENT_EMAIL_FROM && process.env.APPOINTMENT_EMAIL_TO);
}

export async function sendAppointmentNotification(appointment: AppointmentInput, id: string): Promise<void> {
  if (!appointmentEmailConfigured()) throw new Error("Email provider is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `appointment-${id}` },
    body: JSON.stringify({
      from: process.env.APPOINTMENT_EMAIL_FROM,
      to: process.env.APPOINTMENT_EMAIL_TO!.split(",").map((email) => email.trim()),
      subject: "Yêu cầu đặt lịch mới — Nha Khoa 2000",
      text: [
        `Mã lịch: ${id}`, `Họ tên: ${appointment.name}`, `Điện thoại: ${appointment.phone}`,
        `Email: ${appointment.email ?? ""}`, `Cơ sở: ${appointment.clinicId}`,
        `Ngày hẹn: ${new Date(appointment.appointmentDate).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`,
        `Ghi chú: ${appointment.note ?? ""}`,
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
}
