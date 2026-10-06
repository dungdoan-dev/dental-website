"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { appointmentSchema, type AppointmentSchemaInput } from "../schemas/appointment.schema";

type ContactAppointmentFormProps = { services: readonly { id: string; name: string }[] };
type FormStatus = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<keyof AppointmentSchemaInput, string>>;

const fieldClassName = "mt-1.5 w-full rounded-xl border border-border-subtle bg-background-secondary px-4 py-3 text-text-primary outline-none transition focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/20";

export function ContactAppointmentForm({ services }: ContactAppointmentFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input: AppointmentSchemaInput = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? "").replace(/\s+/g, ""),
      email: String(data.get("email") ?? ""),
      serviceId: String(data.get("serviceId") ?? ""),
      appointmentDate: String(data.get("appointmentDate") ?? ""),
      note: String(data.get("note") ?? ""),
    };
    const validation = appointmentSchema.safeParse(input);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0], phone: errors.phone?.[0], email: errors.email?.[0],
        serviceId: errors.serviceId?.[0], appointmentDate: errors.appointmentDate?.[0], note: errors.note?.[0],
      });
      setStatus("error");
      setMessage("Vui lòng kiểm tra lại thông tin đặt lịch.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    setFieldErrors({});
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Không thể gửi yêu cầu đặt lịch.");
      form.reset();
      setStatus("success");
      setMessage("Yêu cầu đã được xử lý trong bản demo. Vui lòng gọi hotline để xác nhận lịch khám.");
    } catch (error: unknown) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Không thể gửi yêu cầu đặt lịch lúc này.");
    }
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-white p-6 shadow-sm sm:p-8">
      <h2 className="pr-10 text-2xl font-bold text-text-primary">Đăng ký lịch thăm khám</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">Điền thông tin để thử quy trình đặt lịch trực tuyến.</p>
      <form className="mt-7 space-y-5" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-text-primary" htmlFor="appointment-name">Họ và tên <span className="text-red-600">*</span>
            <input aria-describedby={fieldErrors.name ? "appointment-name-error" : undefined} aria-invalid={Boolean(fieldErrors.name)} autoComplete="name" className={fieldClassName} id="appointment-name" name="name" placeholder="Nguyễn Văn A" required type="text" />
            {fieldErrors.name ? <span className="mt-1 block text-xs text-red-600" id="appointment-name-error">{fieldErrors.name}</span> : null}
          </label>
          <label className="block text-sm font-semibold text-text-primary" htmlFor="appointment-phone">Số điện thoại <span className="text-red-600">*</span>
            <input aria-describedby={fieldErrors.phone ? "appointment-phone-error" : undefined} aria-invalid={Boolean(fieldErrors.phone)} autoComplete="tel" className={fieldClassName} id="appointment-phone" inputMode="tel" name="phone" placeholder="0900 000 000" required type="tel" />
            {fieldErrors.phone ? <span className="mt-1 block text-xs text-red-600" id="appointment-phone-error">{fieldErrors.phone}</span> : null}
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-text-primary" htmlFor="appointment-email">Email (không bắt buộc)
            <input aria-describedby={fieldErrors.email ? "appointment-email-error" : undefined} aria-invalid={Boolean(fieldErrors.email)} autoComplete="email" className={fieldClassName} id="appointment-email" name="email" placeholder="email@example.com" type="email" />
            {fieldErrors.email ? <span className="mt-1 block text-xs text-red-600" id="appointment-email-error">{fieldErrors.email}</span> : null}
          </label>
          <label className="block text-sm font-semibold text-text-primary" htmlFor="appointment-service">Dịch vụ quan tâm
            <select className={fieldClassName} defaultValue="" id="appointment-service" name="serviceId"><option value="">Cần tư vấn thêm</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select>
          </label>
        </div>
        <label className="block text-sm font-semibold text-text-primary" htmlFor="appointment-date">Ngày và giờ mong muốn <span className="text-red-600">*</span>
          <input aria-describedby={fieldErrors.appointmentDate ? "appointment-date-error" : undefined} aria-invalid={Boolean(fieldErrors.appointmentDate)} className={fieldClassName} id="appointment-date" name="appointmentDate" required type="datetime-local" />
          {fieldErrors.appointmentDate ? <span className="mt-1 block text-xs text-red-600" id="appointment-date-error">{fieldErrors.appointmentDate}</span> : null}
        </label>
        <label className="block text-sm font-semibold text-text-primary" htmlFor="appointment-note">Ghi chú (không bắt buộc)
          <textarea aria-describedby={fieldErrors.note ? "appointment-note-error" : undefined} aria-invalid={Boolean(fieldErrors.note)} className={`${fieldClassName} min-h-28 resize-y`} id="appointment-note" maxLength={1000} name="note" placeholder="Tình trạng răng miệng hoặc câu hỏi của bạn..." />
          {fieldErrors.note ? <span className="mt-1 block text-xs text-red-600" id="appointment-note-error">{fieldErrors.note}</span> : null}
        </label>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue-dark px-6 py-3.5 font-bold text-white transition hover:bg-brand-blue disabled:cursor-wait disabled:opacity-60 sm:w-auto" disabled={status === "submitting"} type="submit"><Icon className="h-5 w-5" name="calendar" />{status === "submitting" ? "Đang gửi..." : "Gửi yêu cầu đặt lịch"}</button>
        {message ? <p aria-live="polite" className={`rounded-xl px-4 py-3 text-sm ${status === "success" ? "bg-brand-green-light text-brand-green-dark" : "bg-red-50 text-red-700"}`} role={status === "error" ? "alert" : "status"}>{message}</p> : null}
        <p className="text-xs leading-relaxed text-text-secondary">Lưu ý: Form hiện ở chế độ demo, chưa lưu lịch hoặc gửi thông tin tới cơ sở. Vui lòng gọi hotline để xác nhận lịch khám thực tế.</p>
      </form>
    </div>
  );
}
