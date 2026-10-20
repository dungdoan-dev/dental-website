import "server-only";
import { appointmentEmailConfigured, sendAppointmentNotification } from "@/lib/mail";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function processAppointmentNotifications(): Promise<{ sent: number; failed: number; configured: boolean }> {
  if (!appointmentEmailConfigured()) return { sent: 0, failed: 0, configured: false };
  const supabase = getSupabaseServiceClient();
  const { data: jobs, error } = await supabase.rpc("claim_appointment_notifications", { p_limit: 5 });
  if (error) throw new Error("Notification queue unavailable");
  let sent = 0;
  let failed = 0;
  for (const job of jobs ?? []) {
    try {
      const { data: row, error: readError } = await supabase.from("appointments").select("name,phone,email,clinic_id,appointment_date,note").eq("id", job.appointment_id).single();
      if (readError) throw readError;
      await sendAppointmentNotification({ name: row.name, phone: row.phone, email: row.email ?? undefined, clinicId: row.clinic_id, appointmentDate: row.appointment_date, note: row.note ?? undefined }, String(job.appointment_id));
      const { error: updateError } = await supabase.from("appointment_notification_outbox").update({ status: "sent", sent_at: new Date().toISOString(), last_error: null }).eq("appointment_id", job.appointment_id).eq("attempts", job.attempts);
      if (updateError) throw updateError;
      sent++;
    } catch {
      failed++;
      // Keep patient information out of operational logs and saved error messages.
      const { error: updateError } = await supabase.from("appointment_notification_outbox").update({ status: "failed", last_error: "Không gửi được email; sẽ thử lại.", available_at: new Date(Date.now() + Math.min(3600, 60 * 2 ** job.attempts) * 1000).toISOString() }).eq("appointment_id", job.appointment_id).eq("attempts", job.attempts);
      if (updateError) console.error("Notification retry state failed", updateError.code);
    }
  }
  return { sent, failed, configured: true };
}
