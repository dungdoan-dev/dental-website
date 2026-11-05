import type { AppointmentInput } from "@/features/appointments/types/appointment.type";

export function appointmentEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.APPOINTMENT_EMAIL_FROM);
}

/** Recipients: the clinic mailbox, plus any extra addresses in APPOINTMENT_EMAIL_TO. */
export async function sendAppointmentNotification(appointment: AppointmentInput, id: string, clinicEmail?: string | null): Promise<void> {
  if (!appointmentEmailConfigured()) throw new Error("Email provider is not configured");
  const recipients = [...new Set([clinicEmail, ...(process.env.APPOINTMENT_EMAIL_TO ?? "").split(",")].map((email) => email?.trim()).filter((email): email is string => Boolean(email)))];
  if (recipients.length === 0) throw new Error("No notification recipient is configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `appointment-${id}` },
    body: JSON.stringify({
      from: process.env.APPOINTMENT_EMAIL_FROM,
      to: recipients,
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
