"use client";

import { useState, useTransition } from "react";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type {
  Doctor,
  DoctorCategory,
} from "@/features/doctors/types/doctor.type";
import { upsertDoctor } from "../actions";
import { EditableRows } from "./EditableRows";

const CATEGORIES: { label: string; value: DoctorCategory }[] = [
  { label: "Cấy Ghép Implant", value: "implant" },
  { label: "Chỉnh Nha - Niềng Răng", value: "ortho" },
  { label: "Răng Sứ & Thẩm Mỹ", value: "aesthetic" },
  { label: "Phẫu Thuật Hàm Mặt & Nha Chu", value: "surgery" },
  { label: "Nha Khoa Trẻ Em & Tổng Quát", value: "pediatric" },
];

export function DoctorFormDialog({
  doctor,
  buttonLabel = "Sửa",
  buttonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm",
}: {
  doctor?: Doctor;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);

  const [formData, setFormData] = useState({
    id: doctor?.id ?? "",
    name: doctor?.name ?? "",
    slug: doctor?.slug ?? "",
    avatar: doctor?.avatar ?? "/images/doctors/vo-van-tu-hien.jpg",
    position: doctor?.position ?? "Bác Sĩ Chuyên Khoa",
    specialty: doctor?.specialty ?? "Nha khoa tổng quát",
    experience: doctor?.experience ?? 10,
    description: doctor?.description ?? "",
    badge: doctor?.badge ?? "Bác sĩ",
    highlight: doctor?.highlight ?? "Hơn 10 năm kinh nghiệm",
    featured: doctor?.featured ?? false,
    category: doctor?.category ?? ("implant" as DoctorCategory),
    directoryTitle: doctor?.directoryTitle ?? "Chuyên Gia Nha Khoa",
    licenseNumber: doctor?.profile?.licenseNumber ?? "",
    quote: doctor?.profile?.quote ?? "",
    education: [...(doctor?.profile?.education ?? [])],
    specialties: [...(doctor?.profile?.specialties ?? [])],
    experienceHighlights: [...(doctor?.profile?.experienceHighlights ?? [])],
    languages: [...(doctor?.profile?.languages ?? [])],
    certificates: [...(doctor?.profile?.certificates ?? [])],
    sourceUrl: doctor?.profile?.sourceUrl ?? "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/^(bs\.|ths\.bs|bs\.cki|bs\.ckii)\s+/i, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: doctor ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setResult(null);
      try {
        const saved = await upsertDoctor({
        ...formData,
        id: formData.id || `doctor-${crypto.randomUUID()}`,
        experience: Number(formData.experience),
      });
        setResult(saved);
        if (saved.success) setIsOpen(false);
      } catch { setResult({ success: false, error: "Không thể lưu thay đổi. Vui lòng thử lại." }); }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 pt-4 backdrop-blur-sm sm:p-6 sm:pt-8">
          <div className="admin-dialog-panel relative flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-2xl sm:max-h-[calc(100dvh-4rem)]">
            <div className="admin-dialog-header flex shrink-0 items-center justify-between border-b border-border-subtle/60 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {doctor ? "Chỉnh sửa Hồ Sơ Bác Sĩ" : "Thêm Bác Sĩ Mới"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-text-secondary hover:bg-surface-container hover:text-text-primary transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm sm:px-7">
              <FormFeedback result={result} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Họ và tên bác sĩ (kèm học vị) *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="BS.CKII Võ Văn Tự Hiến"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Slug URL *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary font-mono focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="vo-van-tu-hien"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Chức vụ *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="Trưởng khoa Chỉnh nha"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Chuyên khoa *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="Cấy ghép Implant"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Số năm kinh nghiệm *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Nhóm chuyên môn *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as DoctorCategory,
                      })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Tiêu đề danh bạ
                  </label>
                  <input
                    type="text"
                    value={formData.directoryTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        directoryTitle: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="Chuyên Gia Cấy Ghép Implant"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">
                  Mô tả giới thiệu kinh nghiệm *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  placeholder="Hơn 15 năm kinh nghiệm phục hình dán sứ vi phẫu..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Ảnh chân dung *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData({ ...formData, avatar: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary font-mono focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Điểm nổi bật
                  </label>
                  <input
                    type="text"
                    value={formData.highlight}
                    onChange={(e) =>
                      setFormData({ ...formData, highlight: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="Hơn 35 năm kinh nghiệm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Số CCHN
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                    placeholder="010749/HCM-CCHN"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Trích dẫn y đức (Quote)
                  </label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) =>
                      setFormData({ ...formData, quote: e.target.value })
                    }
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <EditableRows label="Học vấn và đào tạo" columns={[{ key: "value", label: "Nội dung", multiline: true }]} value={formData.education.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, education: rows.map((row) => row.value) })} />
              <EditableRows label="Chuyên môn chi tiết" columns={[{ key: "value", label: "Nội dung", multiline: true }]} value={formData.specialties.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, specialties: rows.map((row) => row.value) })} />
              <EditableRows label="Kinh nghiệm nổi bật" columns={[{ key: "value", label: "Nội dung", multiline: true }]} value={formData.experienceHighlights.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, experienceHighlights: rows.map((row) => row.value) })} />
              <EditableRows label="Ngôn ngữ" columns={[{ key: "value", label: "Nội dung", multiline: true }]} value={formData.languages.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, languages: rows.map((row) => row.value) })} />
              <EditableRows label="Chứng chỉ và bằng cấp" columns={[{ key: "title", label: "Tên chứng chỉ" }, { key: "issuer", label: "Đơn vị cấp" }, { key: "detail", label: "Chi tiết", multiline: true }, { key: "image", label: "Đường dẫn ảnh" }]} value={formData.certificates} onChange={(rows) => setFormData({ ...formData, certificates: rows.map((row) => ({ title: row.title, issuer: row.issuer, detail: row.detail, image: row.image })) })} />
              <label className="block text-xs font-semibold">URL nguồn hồ sơ<input className="mt-1 min-h-11 w-full rounded-lg border border-border-subtle px-3" type="url" value={formData.sourceUrl} onChange={(event) => setFormData({ ...formData, sourceUrl: event.target.value })} /></label>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-text-primary font-medium">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border-subtle text-brand-blue-dark accent-brand-blue-dark cursor-pointer"
                  />
                  <span>Đánh dấu bác sĩ nổi bật</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle/60">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-container"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-brand-blue-dark px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-blue disabled:opacity-50 transition-all"
                >
                  {isPending ? "Đang lưu..." : "Lưu Bác Sĩ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
