import type { AppointmentInput } from "@/features/appointments/types/appointment.type";

export async function sendAppointmentNotification(appointment: AppointmentInput): Promise<void> {
  // Điểm tích hợp dịch vụ email sẽ được triển khai khi có nhà cung cấp thực tế.
  void appointment;
  return Promise.resolve();
}
