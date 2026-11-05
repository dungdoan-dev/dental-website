"use client";

import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type PhoneNumberFieldProps = {
  id: string;
  errorId?: string;
  invalid?: boolean;
  compact?: boolean;
};

export function PhoneNumberField({ id, errorId, invalid = false, compact = false }: PhoneNumberFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState({ iso2: "vn", dialCode: "84" });
  // The library writes the new dial code into the number when the flag changes; remounting with the kept number undoes that.
  const [inputKey, setInputKey] = useState(0);
  const dialCode = country.dialCode;

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
    <div className={`${compact ? "mt-0.5" : "mt-1.5"} relative min-w-0`} ref={containerRef}>
      <PhoneInput
        containerClass={`appointment-phone-input${compact ? " appointment-phone-input--compact" : ""}`}
        country={country.iso2}
        key={inputKey}
        enableSearch
        inputProps={{ id, autoComplete: "tel", required: true, "aria-invalid": invalid, "aria-describedby": errorId }}
        disableCountryCode
        disableCountryGuess
        onChange={(value, data) => {
          const next = data as { countryCode?: string; dialCode?: string };
          if (next.dialCode && next.dialCode !== dialCode) {
            setCountry({ iso2: next.countryCode ?? country.iso2, dialCode: next.dialCode });
            setInputKey((key) => key + 1);
            return;
          }
          setPhone(value);
        }}
        placeholder="Nhập số điện thoại của bạn"
        preferredCountries={["vn", "us", "gb", "kr", "jp", "sg", "th", "cn"]}
        searchNotFound="Không tìm thấy quốc gia"
        searchPlaceholder="Tìm quốc gia..."
        value={phone}
      />
      <span aria-hidden="true" className="appointment-phone-dial">+{dialCode}</span>
      <input name="phone" type="hidden" value={phone ? `+${dialCode}${phone.replace(/^0+/, "")}` : ""} />
    </div>
  );
}
