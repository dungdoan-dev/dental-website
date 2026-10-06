"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Doctor } from "../types/doctor.type";

type DoctorBookingSectionProps = { doctors: readonly Doctor[] };
type SubmitState = "idle" | "submitting" | "success" | "error";

export function DoctorBookingSection({ doctors }: DoctorBookingSectionProps) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "08:30");
    const doctor = String(data.get("doctor") ?? "");
    const clinic = String(data.get("clinic") ?? "");
    const note = String(data.get("note") ?? "");
    try {
      const response = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: String(data.get("name") ?? ""), phone: String(data.get("phone") ?? "").replace(/\s+/g, ""), email: "", serviceId: doctor, appointmentDate: `${date}T${time}:00`, note: `Bác sĩ: ${doctor || "Phù hợp nhất"}. Cơ sở: ${clinic}. Khung giờ: ${time}. ${note}`.trim() }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Không thể gửi lịch hẹn");
      setSubmitState("success");
      setMessage("Đã Gửi Thành Công! CSKH sẽ gọi lại ngay");
      form.reset();
    } catch (error: unknown) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Không thể gửi lịch hẹn");
    }
  }

  const fieldClass = "w-full rounded-xl bg-surface-container-low px-4 py-3 text-text-primary outline-none transition focus:bg-white focus:ring-2 focus:ring-brand-blue";
  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24" id="booking-section">
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin"><div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue-dark to-[#005e90] p-8 text-white shadow-xl md:p-14"><div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-brand-blue/30 blur-3xl" /><div className="pointer-events-none absolute right-1/3 top-0 h-64 w-64 rounded-full bg-brand-green/20 blur-2xl" />
        <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12"><div className="space-y-6 lg:col-span-6"><div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold text-brand-blue-light backdrop-blur-md"><Icon className="h-4 w-4" name="calendar" />ĐẶT LỊCH TRỰC TIẾP VỚI BÁC SĨ CHUYÊN KHOA</div><h2 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-[3.5rem]">Khám &amp; Tư Vấn Trực Tiếp Cùng Chuyên Gia</h2><p className="text-lg leading-relaxed text-white/90">Nhận ngay gói thăm khám tổng quát chuyên sâu hoàn toàn miễn phí bao gồm chụp phim Cone Beam CT 3D trị giá 500.000đ khi đăng ký trực tuyến hôm nay.</p><div className="space-y-3 pt-2">{["Chủ động lựa chọn bác sĩ khám theo mong muốn", "Không phải chờ đợi – Có điều dưỡng riêng đón tiếp", "Miễn phí chụp phim CT 3D & lên phác đồ điều trị 1:1"].map((item) => <div className="flex items-center gap-3" key={item}><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-white"><Icon className="h-4 w-4" name="check" /></span><span className="text-white/95">{item}</span></div>)}</div><div className="flex flex-wrap items-center gap-4 pt-4">{["CS1: 1900 966 960", "CS2: 1900 888 642"].map((phone) => <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 backdrop-blur-md" key={phone}><Icon className="h-5 w-5 text-brand-green-light" name="phone" /><span className="text-[13px] font-semibold">{phone}</span></div>)}</div></div>
          <div className="lg:col-span-6"><div className="rounded-3xl bg-white p-6 text-text-primary shadow-2xl sm:p-8"><h3 className="text-2xl font-bold text-brand-blue-dark">Đăng Ký Khám Chuyên Khoa</h3><p className="mb-6 mt-2 text-sm text-text-secondary">Vui lòng điền thông tin bên dưới, nhân viên y tế của Nha Khoa 2000 sẽ liên hệ xác nhận lịch trong 15 phút.</p><form className="space-y-4" onSubmit={handleSubmit}><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-[13px] font-bold">Họ và tên *<input className={`${fieldClass} mt-1.5`} name="name" placeholder="Nguyễn Văn A" required type="text" /></label><label className="text-[13px] font-bold">Số điện thoại *<input className={`${fieldClass} mt-1.5`} name="phone" placeholder="0901 234 567" required type="tel" /></label></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-[13px] font-bold">Bác sĩ mong muốn<select className={`${fieldClass} mt-1.5`} name="doctor"><option value="">Bác sĩ phù hợp nhất</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.directoryTitle})</option>)}</select></label><label className="text-[13px] font-bold">Cơ sở khám<select className={`${fieldClass} mt-1.5`} name="clinic"><option value="Cơ sở 1: 99 Hồ Hảo Hớn, Q.1">Cơ sở 1: 99 Hồ Hảo Hớn, Q.1</option><option value="Cơ sở 2: 502 Ngô Gia Tự, Q.5">Cơ sở 2: 502 Ngô Gia Tự, Q.5</option></select></label></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="text-[13px] font-bold">Ngày mong muốn<input className={`${fieldClass} mt-1.5`} name="date" required type="date" /></label><label className="text-[13px] font-bold">Khung giờ<select className={`${fieldClass} mt-1.5`} name="time"><option value="08:30">Sáng (08:30 - 11:30)</option><option value="13:30">Chiều (13:30 - 17:00)</option><option value="17:30">Tối (17:30 - 19:30)</option></select></label></div><label className="block text-[13px] font-bold">Nhu cầu hoặc tình trạng răng miệng<textarea className={`${fieldClass} mt-1.5 resize-y`} name="note" placeholder="Ví dụ: Tư vấn niềng răng trong suốt, nhổ răng khôn mọc lệch, làm răng sứ..." rows={2} /></label><button className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-wait disabled:opacity-70 ${submitState === "success" ? "bg-brand-blue-dark" : "bg-brand-green hover:bg-brand-green-dark"}`} disabled={submitState === "submitting"} type="submit"><Icon className="h-5 w-5" name={submitState === "success" ? "check" : "send"} />{submitState === "submitting" ? "Đang gửi xác nhận..." : submitState === "success" ? "Đã Gửi Thành Công!" : "XÁC NHẬN ĐĂNG KÝ HẸN BÁC SĨ"}</button>{message ? <p aria-live="polite" className={`text-center text-sm font-semibold ${submitState === "error" ? "text-red-600" : "text-brand-green-dark"}`}>{message}</p> : null}<p className="text-center text-[11px] font-bold text-text-secondary">* Thông tin của bạn được bảo mật tuyệt đối theo quy định y khoa của Bộ Y Tế.</p></form></div></div>
        </div>
      </div></div>
    </section>
  );
}
