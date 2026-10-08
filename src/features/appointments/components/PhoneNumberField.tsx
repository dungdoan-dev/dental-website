"use client";

import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";

type PhoneNumberFieldProps = {
  id: string;
  errorId?: string;
  invalid?: boolean;
  compact?: boolean;
};

export function PhoneNumberField({ id, errorId, invalid = false, compact = false }: PhoneNumberFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => {
      container.style.setProperty("--phone-field-width", `${container.getBoundingClientRect().width}px`);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    const resetPhone = () => setPhone("");
    form?.addEventListener("reset", resetPhone);
    return () => form?.removeEventListener("reset", resetPhone);
  }, []);

  return (
    <div className={`${compact ? "mt-0.5" : "mt-1.5"} min-w-0`} ref={containerRef}>
      <PhoneInput
        containerClass={`appointment-phone-input${compact ? " appointment-phone-input--compact" : ""}`}
        country="vn"
        countryCodeEditable={false}
        enableSearch
        inputProps={{ id, autoComplete: "tel", required: true, "aria-invalid": invalid, "aria-describedby": errorId }}
        onChange={(value) => setPhone(value)}
        placeholder="Nhập số điện thoại"
        preferredCountries={["vn", "us", "gb", "kr", "jp", "sg", "th", "cn"]}
        searchNotFound="Không tìm thấy quốc gia"
        searchPlaceholder="Tìm quốc gia..."
        value={phone}
      />
      <input name="phone" type="hidden" value={phone ? `+${phone}` : ""} />
    </div>
  );
}
