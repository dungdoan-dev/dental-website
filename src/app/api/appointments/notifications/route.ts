import { timingSafeEqual } from "node:crypto";
import { processAppointmentNotifications } from "@/features/appointments/services/notification.service";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization") ?? "";
  if (!secret) return Response.json({ error: "Notification scheduler is not configured" }, { status: 503 });
  const expected = `Bearer ${secret}`;
  if (Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return new Response(null, { status: 401 });
  try { return Response.json(await processAppointmentNotifications(), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "Notification queue unavailable" }, { status: 503 }); }
}
