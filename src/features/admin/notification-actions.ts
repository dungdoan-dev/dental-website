"use server";

import { requireAdmin } from "./auth/admin-auth";
import { processAppointmentNotifications } from "@/features/appointments/services/notification.service";
import type { MutationResult } from "./services/mutation";

export async function retryAppointmentNotifications(): Promise<MutationResult> {
  await requireAdmin();
  try {
    const result = await processAppointmentNotifications();
    if (!result.configured) return { success: false, error: "Chưa cấu hình kênh thông báo email. Lịch hẹn vẫn được lưu trong hệ thống." };
    if (result.failed) return { success: false, error: `Đã gửi ${result.sent} thông báo, ${result.failed} thông báo cần thử lại sau.` };
    return { success: true };
  } catch { return { success: false, error: "Chưa thể xử lý thông báo. Vui lòng thử lại sau." }; }
}
