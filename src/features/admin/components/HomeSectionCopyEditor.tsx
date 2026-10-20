"use client";

import { useId, useState } from "react";
import { Tabs } from "radix-ui";
import { Eye, LayoutTemplate } from "lucide-react";
import type { HomeSectionCopyMap } from "@/features/home/home-section-copy";
import { Input } from "@/components/admin-ui/input";
import { Textarea } from "@/components/admin-ui/textarea";

const sections = ["vision", "values", "services", "doctors", "whyChoose", "clinics", "insurance", "faq", "testimonials"] as const satisfies readonly (keyof HomeSectionCopyMap)[];
const labels: Record<keyof HomeSectionCopyMap, string> = {
  services: "Dịch vụ", doctors: "Đội ngũ bác sĩ", whyChoose: "Lý do lựa chọn", clinics: "Cơ sở",
  insurance: "Bảo hiểm", faq: "Câu hỏi thường gặp", testimonials: "Đánh giá khách hàng",
  vision: "Tầm nhìn & sứ mệnh", values: "Giá trị cốt lõi",
};

export function HomeSectionCopyEditor({ initialCopy }: { initialCopy: HomeSectionCopyMap }) {
  const [copy, setCopy] = useState(initialCopy);
  const id = useId();

  function update(section: keyof HomeSectionCopyMap, field: "title" | "note", value: string) {
    setCopy((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
  }

  return (
    <>
      {/* Keep every section in the submission even when its tab is not mounted. */}
      {sections.map((section) => <span hidden key={section}>
        <input name={`${section}Title`} type="hidden" value={copy[section].title} />
        <input name={`${section}Note`} type="hidden" value={copy[section].note} />
      </span>)}
      <Tabs.Root className="grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]" defaultValue="vision">
        <Tabs.List aria-label="Mục nội dung trang chủ" className="flex gap-1 overflow-x-auto rounded-xl border border-border-subtle bg-background-secondary p-2 lg:flex-col lg:self-start">
          {sections.map((section, index) => (
            <Tabs.Trigger className="group flex min-h-11 shrink-0 items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm font-medium text-text-secondary transition hover:bg-white hover:text-text-primary data-[state=active]:border-border-subtle data-[state=active]:bg-white data-[state=active]:text-brand-blue-dark data-[state=active]:shadow-xs" key={section} value={section}>
              <span aria-hidden="true" className="font-mono text-[11px] opacity-60">{String(index + 1).padStart(2, "0")}</span>
              {labels[section]}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {sections.map((section) => (
          <Tabs.Content className="min-w-0 space-y-6 outline-none" key={section} value={section}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-blue-light text-brand-blue-dark"><LayoutTemplate aria-hidden="true" className="size-5" /></span>
              <div><h3 className="text-base font-semibold text-text-primary">{labels[section]}</h3><p className="mt-1 text-xs leading-relaxed text-text-secondary">Tiêu đề và lời giới thiệu hiển thị trên trang chủ.</p>{section === "vision" ? <p className="mt-1 text-xs leading-relaxed text-text-secondary">Phần này chỉ đổi tiêu đề và mô tả chung. Nội dung hai khối Tầm nhìn, Sứ mệnh trên trang chủ hiện là nội dung cố định; form trang Giới thiệu không thay đổi hai khối này.</p> : null}</div>
            </div>
            <div className="space-y-5">
              <label htmlFor={`${id}-${section}-title`}>Tiêu đề <span className="sr-only">bắt buộc</span>
                <Input id={`${id}-${section}-title`} maxLength={160} onChange={(event) => update(section, "title", event.target.value)} required value={copy[section].title} />
              </label>
              <label htmlFor={`${id}-${section}-note`}>Mô tả ngắn
                <Textarea id={`${id}-${section}-note`} maxLength={400} onChange={(event) => update(section, "note", event.target.value)} placeholder="Thêm lời giới thiệu cho mục này…" rows={3} value={copy[section].note} />
              </label>
              <p className="-mt-3 text-right text-xs tabular-nums text-text-secondary">{copy[section].note.length}/400 ký tự</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border-subtle">
              <div className="flex items-center gap-2 border-b border-border-subtle bg-background-secondary px-4 py-2.5 text-xs font-medium text-text-secondary"><Eye aria-hidden="true" className="size-3.5" />Xem trước nội dung</div>
              <div className="space-y-3 px-5 py-7 text-center sm:px-8">
                <h4 className="break-words text-xl font-bold leading-snug tracking-tight text-brand-blue-dark">{copy[section].title || "Tiêu đề mục"}</h4>
                <p className="mx-auto max-w-xl whitespace-pre-line break-words text-sm leading-relaxed text-text-secondary">{copy[section].note || "Mô tả sẽ xuất hiện tại đây."}</p>
              </div>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <p className="text-xs leading-relaxed text-text-secondary">Chuyển mục để chỉnh sửa tiếp. Nút lưu bên dưới sẽ lưu nội dung của cả {sections.length} mục.</p>
    </>
  );
}
