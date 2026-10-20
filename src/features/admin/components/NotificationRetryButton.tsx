"use client";
import { useTransition } from "react";
import { Mail, LoaderCircle } from "lucide-react";
import { Button } from "@/components/admin-ui/button";
import { retryAppointmentNotifications } from "../notification-actions";
import { showMutationToast } from "./AdminToast";

export function NotificationRetryButton() {
  const [pending, startTransition] = useTransition();
  return <Button disabled={pending} onClick={() => startTransition(async () => {
    try { showMutationToast(await retryAppointmentNotifications(), "Đã xử lý các thông báo đang chờ."); }
    catch { showMutationToast({ success: false, error: "Không thể xử lý thông báo." }, ""); }
  })} size="sm" type="button" variant="outline">{pending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Mail aria-hidden="true" />}Gửi thông báo chờ</Button>;
}
