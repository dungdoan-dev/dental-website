"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { AppointmentClinicOption } from "../types/appointment.type";

const AppointmentForm = dynamic(() => import("./AppointmentForm").then((module) => module.AppointmentForm), {
  loading: () => <p className="py-8 text-center text-sm text-text-secondary" role="status">Đang tải form đặt lịch…</p>,
});

export function DeferredAppointmentForm({ clinics, services }: {
  clinics: readonly AppointmentClinicOption[];
  services: readonly { id: string; name: string }[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    if (!("IntersectionObserver" in window)) {
      // The explicit button remains usable in browsers without observation support.
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: "400px" });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  return <div className="min-h-[760px] sm:min-h-[640px]" ref={root}>
    {ready ? <AppointmentForm clinics={clinics} services={services} /> : <div className="rounded-2xl border border-border-subtle bg-white p-6 text-center sm:p-8">
      <h2 className="text-xl font-bold text-text-primary">Đăng ký lịch thăm khám</h2>
      <p className="mt-3 text-sm text-text-secondary">Chọn cơ sở và thời gian phù hợp để gửi yêu cầu đặt lịch.</p>
      <button className="mt-6 min-h-11 rounded-lg bg-brand-blue-dark px-5 font-semibold text-white" onClick={() => setReady(true)} type="button">Mở form đặt lịch</button>
    </div>}
  </div>;
}
