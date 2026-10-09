"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { appointmentShifts } from "../data/appointment-shifts";
import {
  appointmentSchema,
  type AppointmentSchemaInput,
} from "../schemas/appointment.schema";
import type { AppointmentClinicOption } from "../types/appointment.type";
import { DatePickerField } from "./DatePickerField";
import { PhoneNumberField } from "./PhoneNumberField";

type AppointmentFormProps = {
  services: readonly { id: string; name: string }[];
  clinics: readonly AppointmentClinicOption[];
  title?: string;
  description?: string;
  compact?: boolean;
};
type FormStatus = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<keyof AppointmentSchemaInput, string>>;

const fieldBaseClassName =
  "min-h-11 min-w-0 w-full rounded-xl border border-border-subtle bg-background-secondary text-base sm:text-sm font-normal text-text-primary outline-none transition focus:border-brand-blue-dark focus:bg-white focus:ring-2 focus:ring-brand-blue-dark/20";

const fieldNames = {
  name: "name",
  phone: "phone",
  email: "email",
  serviceId: "service",
  doctorId: "doctor",
  clinicId: "clinic",
  appointmentDate: "date",
  preferredShift: "shift",
  note: "note",
} satisfies Record<keyof AppointmentSchemaInput, string>;

export function AppointmentForm({
  services,
  clinics,
  title = "Đăng ký lịch thăm khám",
  description = "Chọn cơ sở và thời gian phù hợp để gửi yêu cầu đặt lịch.",
  compact = false,
}: AppointmentFormProps) {
  const fieldClassName = `${compact ? "mt-0.5 w-full px-3 py-2" : "mt-1.5 w-full px-4 py-3"} ${fieldBaseClassName}`;
  const formId = useId();
  const fieldId = (field: string): string => `${formId}-${field}`;
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const errorEntries = Object.entries(fieldErrors).filter(
    (entry): entry is [keyof AppointmentSchemaInput, string] =>
      Boolean(entry[1]),
  );

  function focusErrors(): void {
    window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (status === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const day = String(data.get("appointmentDay") ?? "");
    const shift = appointmentShifts.find(
      (item) => item.id === data.get("preferredShift"),
    );
    const input: AppointmentSchemaInput = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      serviceId: String(data.get("serviceId") ?? ""),
      clinicId: String(data.get("clinicId") ?? ""),
      appointmentDate: day
        ? `${day}T${shift?.startsAt ?? "08:00"}:00+07:00`
        : "",
      preferredShift: shift?.id,
      note: String(data.get("note") ?? ""),
    };
    const validation = appointmentSchema.safeParse(input);

    if (!validation.success || !shift) {
      const errors = validation.success
        ? undefined
        : validation.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors?.name?.[0],
        phone: errors?.phone?.[0],
        email: errors?.email?.[0],
        serviceId: errors?.serviceId?.[0],
        clinicId: errors?.clinicId?.[0],
        appointmentDate: errors?.appointmentDate?.[0],
        preferredShift: !shift
          ? "Vui lòng chọn ca khám"
          : errors?.preferredShift?.[0],
        note: errors?.note?.[0],
      });
      setStatus("error");
      setMessage("Vui lòng kiểm tra lại thông tin đặt lịch.");
      focusErrors();
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
      const result = (await response.json()) as {
        message?: string;
        errors?: Partial<Record<keyof AppointmentSchemaInput, string[]>>;
      };
      if (!response.ok) {
        const errors: FieldErrors = {};
        for (const field of Object.keys(
          fieldNames,
        ) as (keyof AppointmentSchemaInput)[]) {
          const error = result.errors?.[field]?.[0];
          if (typeof error === "string") errors[field] = error;
        }
        setFieldErrors(errors);
        throw new Error(
          result.message ?? "Không thể gửi yêu cầu đặt lịch. Vui lòng thử lại.",
        );
      }
      form.reset();
      setStatus("success");
      setMessage(
        "Yêu cầu đặt lịch đã được ghi nhận. Phòng khám sẽ liên hệ để xác nhận lịch khám.",
      );
    } catch (error: unknown) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Không thể gửi yêu cầu đặt lịch lúc này.",
      );
      focusErrors();
    }
  }

  return (
    <div
      className={`border border-border-subtle bg-white shadow-sm ${compact ? "rounded-2xl p-4 sm:p-5" : "rounded-3xl p-6 sm:p-8"}`}
    >
      <h2
        className={`pr-10 font-bold text-text-primary ${compact ? "text-lg" : "text-2xl"}`}
        tabIndex={-1}
      >
        {title}
      </h2>
      <p
        className={`text-sm leading-relaxed text-text-secondary ${compact ? "mt-1" : "mt-2"}`}
      >
        {description}
      </p>
      <form
        className={`${compact ? "mt-3 space-y-2.5" : "mt-7 space-y-5"}`}
        noValidate
        onSubmit={handleSubmit}
      >
        {status === "error" && message ? (
          <div
            className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            ref={errorSummaryRef}
            role="alert"
            tabIndex={-1}
          >
            <p className="font-semibold">{message}</p>
            {errorEntries.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {errorEntries.map(([field, error]) => (
                  <li key={field}>
                    <a
                      className="underline underline-offset-2"
                      href={`#${fieldId(fieldNames[field])}`}
                      onClick={(event) => {
                        event.preventDefault();
                        document
                          .getElementById(fieldId(fieldNames[field]))
                          ?.focus();
                      }}
                    >
                      {error}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div
          className={`grid sm:grid-cols-2 ${compact ? "gap-x-3 gap-y-2.5" : "gap-5"}`}
        >
          <label
            className="block min-w-0 text-sm font-semibold text-text-primary"
            htmlFor={fieldId("name")}
          >
            Họ và tên <span className="text-red-600">*</span>
            <input
              aria-describedby={
                fieldErrors.name ? fieldId("name-error") : undefined
              }
              aria-invalid={Boolean(fieldErrors.name)}
              autoComplete="name"
              className={fieldClassName}
              id={fieldId("name")}
              name="name"
              placeholder="Nguyễn Văn A"
              required
              type="text"
            />
            {fieldErrors.name ? (
              <span
                className="mt-1 block text-xs text-red-600"
                id={fieldId("name-error")}
              >
                {fieldErrors.name}
              </span>
            ) : null}
          </label>
          <label
            className="block min-w-0 text-sm font-semibold text-text-primary"
            htmlFor={fieldId("phone")}
          >
            Số điện thoại <span className="text-red-600">*</span>
            <PhoneNumberField
              compact={compact}
              errorId={fieldErrors.phone ? fieldId("phone-error") : undefined}
              id={fieldId("phone")}
              invalid={Boolean(fieldErrors.phone)}
            />
            {fieldErrors.phone ? (
              <span
                className="mt-1 block text-xs text-red-600"
                id={fieldId("phone-error")}
              >
                {fieldErrors.phone}
              </span>
            ) : null}
          </label>
          <label
            className="block min-w-0 text-sm font-semibold text-text-primary"
            htmlFor={fieldId("email")}
          >
            Email (không bắt buộc)
            <input
              aria-describedby={
                fieldErrors.email ? fieldId("email-error") : undefined
              }
              aria-invalid={Boolean(fieldErrors.email)}
              autoComplete="email"
              className={fieldClassName}
              id={fieldId("email")}
              name="email"
              placeholder="email@example.com"
              type="email"
            />
            {fieldErrors.email ? (
              <span
                className="mt-1 block text-xs text-red-600"
                id={fieldId("email-error")}
              >
                {fieldErrors.email}
              </span>
            ) : null}
          </label>
          <label
            className="block min-w-0 text-sm font-semibold text-text-primary"
            htmlFor={fieldId("service")}
          >
            Dịch vụ quan tâm
            <select
              aria-describedby={
                fieldErrors.serviceId ? fieldId("service-error") : undefined
              }
              aria-invalid={Boolean(fieldErrors.serviceId)}
              className={fieldClassName}
              defaultValue=""
              id={fieldId("service")}
              name="serviceId"
            >
              <option value="">Cần tư vấn thêm</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {fieldErrors.serviceId ? (
              <span
                className="mt-1 block text-xs text-red-600"
                id={fieldId("service-error")}
              >
                {fieldErrors.serviceId}
              </span>
            ) : null}
          </label>
          <label
            className="block min-w-0 text-sm font-semibold text-text-primary sm:col-span-2"
            htmlFor={fieldId("clinic")}
          >
            Cơ sở thăm khám <span className="text-red-600">*</span>
            <select
              aria-describedby={
                fieldErrors.clinicId ? fieldId("clinic-error") : undefined
              }
              aria-invalid={Boolean(fieldErrors.clinicId)}
              className={fieldClassName}
              defaultValue=""
              id={fieldId("clinic")}
              name="clinicId"
              required
            >
              <option disabled value="">
                Chọn cơ sở
              </option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.label} · {clinic.address}
                </option>
              ))}
            </select>
            {fieldErrors.clinicId ? (
              <span
                className="mt-1 block text-xs text-red-600"
                id={fieldId("clinic-error")}
              >
                {fieldErrors.clinicId}
              </span>
            ) : null}
          </label>
          <label
            className="block min-w-0 text-sm font-semibold text-text-primary"
            htmlFor={fieldId("date")}
          >
            Ngày mong muốn <span className="text-red-600">*</span>
            <DatePickerField
              compact={compact}
              errorId={
                fieldErrors.appointmentDate ? fieldId("date-error") : undefined
              }
              id={fieldId("date")}
              invalid={Boolean(fieldErrors.appointmentDate)}
            />
            {fieldErrors.appointmentDate ? (
              <span
                className="mt-1 block text-xs text-red-600"
                id={fieldId("date-error")}
              >
                {fieldErrors.appointmentDate}
              </span>
            ) : null}
          </label>
          <label
            className="block min-w-0 text-sm font-semibold text-text-primary"
            htmlFor={fieldId("shift")}
          >
            Thời gian mong muốn <span className="text-red-600">*</span>
            <select
              aria-describedby={
                fieldErrors.preferredShift ? fieldId("shift-error") : undefined
              }
              aria-invalid={Boolean(fieldErrors.preferredShift)}
              className={fieldClassName}
              defaultValue=""
              id={fieldId("shift")}
              name="preferredShift"
              required
            >
              <option disabled value="">
                Chọn ca khám
              </option>
              {appointmentShifts.map((shiftOption) => (
                <option key={shiftOption.id} value={shiftOption.id}>
                  {shiftOption.label}: {shiftOption.hours}
                </option>
              ))}
            </select>
            {fieldErrors.preferredShift ? (
              <span
                className="mt-1 block text-xs text-red-600"
                id={fieldId("shift-error")}
              >
                {fieldErrors.preferredShift}
              </span>
            ) : null}
          </label>
        </div>
        <label
          className="block min-w-0 text-sm font-semibold text-text-primary"
          htmlFor={fieldId("note")}
        >
          Ghi chú (không bắt buộc)
          <textarea
            aria-describedby={
              fieldErrors.note ? fieldId("note-error") : undefined
            }
            aria-invalid={Boolean(fieldErrors.note)}
            className={`${fieldClassName} ${compact ? "min-h-14" : "min-h-28"} resize-y`}
            id={fieldId("note")}
            maxLength={1000}
            name="note"
            placeholder="Tình trạng răng miệng hoặc câu hỏi của bạn..."
          />
          {fieldErrors.note ? (
            <span
              className="mt-1 block text-xs text-red-600"
              id={fieldId("note-error")}
            >
              {fieldErrors.note}
            </span>
          ) : null}
        </label>
        <button
          className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-blue-dark px-6 font-bold text-white transition hover:bg-brand-blue-hover disabled:cursor-wait disabled:opacity-60 sm:w-auto ${compact ? "py-2.5 text-sm" : "py-3.5"}`}
          disabled={status === "submitting"}
          type="submit"
        >
          <Icon className="h-5 w-5" name="calendar" />
          {status === "submitting" ? "Đang gửi..." : "Gửi yêu cầu đặt lịch"}
        </button>
        {status === "success" && message ? (
          <p
            aria-live="polite"
            className="rounded-xl bg-brand-green-light px-4 py-3 text-sm text-text-primary"
            role="status"
          >
            {message}
          </p>
        ) : null}
        <p className="text-xs leading-relaxed text-text-secondary">
          Yêu cầu sẽ được lưu để phòng khám xử lý; lịch khám chỉ có hiệu lực sau
          khi cơ sở liên hệ xác nhận. Nếu cần gấp, vui lòng gọi hotline.
        </p>
      </form>
    </div>
  );
}
