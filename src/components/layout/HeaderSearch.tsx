"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls="header-search-panel"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
        className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-low hover:text-brand-blue-dark"
        onClick={() => setIsOpen((current) => !current)}
        ref={toggleRef}
        type="button"
      >
        <Icon name={isOpen ? "close" : "search"} />
      </button>
      {isOpen && (
        <form
          action="/tim-kiem"
          className="fixed inset-x-5 top-[120px] z-50 flex gap-2 rounded-2xl border border-border-subtle bg-white p-3 shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-[380px]"
          id="header-search-panel"
          method="get"
          role="search"
        >
          <label className="sr-only" htmlFor="header-search-input">Từ khóa tìm kiếm</label>
          <input
            className="min-w-0 flex-1 rounded-xl border border-border-subtle px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-blue-dark focus:ring-2 focus:ring-brand-blue/20"
            id="header-search-input"
            maxLength={80}
            name="q"
            placeholder="Dịch vụ, bác sĩ, bài viết..."
            ref={inputRef}
            required
            type="search"
          />
          <button className="rounded-xl bg-brand-blue-dark px-4 py-2 text-sm font-bold text-white transition hover:bg-[#056697]" type="submit">Tìm</button>
        </form>
      )}
    </div>
  );
}
