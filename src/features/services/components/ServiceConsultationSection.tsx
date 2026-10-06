"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import type { DentalService } from "../types/service.type";

type ServiceConsultationSectionProps = { services: readonly DentalService[] };
type SubmitState = "idle" | "submitting" | "success" | "error";

export function ServiceConsultationSection({ services }: ServiceConsultationSectionProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const serviceId = String(data.get("serviceId") ?? "");
    const clinic = String(data.get("clinic") ?? "");
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? "").replace(/\s+/g, ""),
          email: "",
          serviceId,
          appointmentDate: `${String(data.get("date") ?? "")}T09:00:00`,
          note: `Cơ sở: ${clinic}. ${String(data.get("note") ?? "")}`.trim(),
        }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Không thể gửi yêu cầu");
      form.reset();
      setSubmitState("success");
      setMessage("Đăng ký thành công. Đội ngũ Nha Khoa 2000 sẽ sớm liên hệ với bạn.");
    } catch (error: unknown) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Không thể gửi yêu cầu lúc này");
    }
  }

  const fieldClass = "w-full rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-text-primary outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
  return (
    <section className="bg-surface py-16 md:py-20" id="service-consultation">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin">
        <div className="grid overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue-dark to-[#005e90] p-8 text-white md:p-12"><div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-brand-blue/35 blur-3xl" /><div className="relative"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-wide"><Icon className="h-4 w-4" name="chat" />TƯ VẤN CHUYÊN MÔN MIỄN PHÍ</span><h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-4xl">Đăng Ký Tư Vấn &amp; Nhận Báo Giá Chi Tiết</h2><p className="mt-5 leading-relaxed text-white/85">Để lại thông tin, đội ngũ bác sĩ chuyên khoa sẽ liên hệ tư vấn và đề xuất hướng điều trị phù hợp với bạn.</p><ul className="mt-8 space-y-3 text-sm text-white/90">{["Tư vấn rõ ràng, không phát sinh chi phí", "Chủ động chọn dịch vụ và cơ sở", "Thông tin cá nhân được bảo mật"].map((item) => <li className="flex items-center gap-3" key={item}><span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green"><Icon className="h-4 w-4" name="check" /></span>{item}</li>)}</ul></div></div>
          <div className="p-7 md:p-10"><form className="space-y-4" onSubmit={handleSubmit}><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-text-primary">Họ và tên *<input className={`${fieldClass} mt-1.5`} name="name" placeholder="Nguyễn Văn A" required type="text" /></label><label className="text-sm font-bold text-text-primary">Số điện thoại *<input className={`${fieldClass} mt-1.5`} name="phone" placeholder="0901 234 567" required type="tel" /></label></div><label className="block text-sm font-bold text-text-primary">Dịch vụ quan tâm<select className={`${fieldClass} mt-1.5`} name="serviceId"><option value="">Khám tổng quát / Chưa xác định</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-text-primary">Cơ sở khám<select className={`${fieldClass} mt-1.5`} name="clinic"><option value="CS1 - 99 Hồ Hảo Hớn, Q.1">CS1 - 99 Hồ Hảo Hớn, Q.1</option><option value="CS2 - 502 Ngô Gia Tự, Q.5">CS2 - 502 Ngô Gia Tự, Q.5</option></select></label><label className="text-sm font-bold text-text-primary">Ngày mong muốn *<input className={`${fieldClass} mt-1.5`} name="date" required type="date" /></label></div><label className="block text-sm font-bold text-text-primary">Nhu cầu tư vấn<textarea className={`${fieldClass} mt-1.5 resize-y`} name="note" placeholder="Mô tả ngắn tình trạng răng miệng của bạn..." rows={3} /></label><button className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-4 text-sm font-extrabold text-white shadow-md transition hover:bg-brand-green-dark disabled:cursor-wait disabled:opacity-70" disabled={submitState === "submitting"} type="submit"><Icon className="h-5 w-5" name={submitState === "success" ? "check" : "send"} />{submitState === "submitting" ? "Đang gửi yêu cầu..." : "GỬI YÊU CẦU TƯ VẤN"}</button>{message ? <p aria-live="polite" className={`text-center text-sm font-semibold ${submitState === "error" ? "text-red-600" : "text-brand-green-dark"}`}>{message}</p> : null}<p className="text-center text-[11px] text-text-secondary">Bằng việc gửi thông tin, bạn đồng ý để Nha Khoa 2000 liên hệ xác nhận lịch hẹn.</p></form></div>
        </div>
      </div>
    </section>
  );
}
