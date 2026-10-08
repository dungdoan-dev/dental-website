"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { PhoneNumberField } from "@/features/appointments/components/PhoneNumberField";

type SubmitState = "idle" | "submitting" | "success" | "error";
type ImplantBookingFormProps = { serviceId: string };

const fieldClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

export function ImplantBookingForm({ serviceId }: ImplantBookingFormProps) {
  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const clinicId = String(data.get("clinic") ?? "");
    const clinic = siteConfig.clinics.find((item) => item.id === clinicId);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: "",
          serviceId,
          clinicId,
          appointmentDate: `${String(data.get("date") ?? "")}T09:00:00`,
          note: `Tình trạng: ${String(data.get("condition") ?? "Chưa cung cấp")}.`,
        }),
      });
      const result: { message?: string } = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Không thể kiểm tra yêu cầu");
      form.reset();
      setStatus("success");
      setMessage(`Yêu cầu đã được ghi nhận cho ${clinic?.label ?? "cơ sở đã chọn"}. Phòng khám sẽ liên hệ xác nhận lịch.`);
    } catch (error: unknown) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Không thể kiểm tra yêu cầu lúc này.");
    }
  }

  return (
    <form className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-9" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">Họ và tên *<input className={fieldClass} name="name" placeholder="Nguyễn Văn A" required type="text" /></label>
        <label className="text-sm font-semibold text-slate-700" htmlFor="implant-phone">Số điện thoại *<PhoneNumberField id="implant-phone" /></label>
        <label className="text-sm font-semibold text-slate-700">Cơ sở thăm khám *<select className={fieldClass} name="clinic" required>{siteConfig.clinics.map((clinic) => <option key={clinic.id} value={clinic.id}>{clinic.label} · {clinic.address}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700">Ngày mong muốn *<input className={fieldClass} name="date" required type="date" /></label>
      </div>
      <label className="mt-5 block text-sm font-semibold text-slate-700">Tình trạng răng hiện tại<select className={fieldClass} name="condition"><option>Mất 1 răng đơn lẻ</option><option>Mất nhiều răng</option><option>Mất răng toàn hàm</option><option>Răng lung lay cần thăm khám</option><option>Cần tư vấn thêm</option></select></label>
      <button className="mt-6 w-full rounded-xl bg-brand-blue-dark px-6 py-4 text-sm font-bold text-white transition hover:bg-[#056697] disabled:cursor-wait disabled:opacity-60" disabled={status === "submitting"} type="submit">{status === "submitting" ? "Đang kiểm tra..." : "GỬI YÊU CẦU TƯ VẤN"}</button>
      {message && <p aria-live="polite" className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>{message}</p>}
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">Yêu cầu sẽ được lưu để phòng khám xử lý; lịch khám cần được cơ sở xác nhận. Nếu cần gấp, gọi <a className="font-semibold text-brand-blue-dark underline" href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>{siteConfig.contact.phone}</a>.</p>
    </form>
  );
}
