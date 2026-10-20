"use client";

import { useState, useTransition } from "react";
import { AdminDialog } from "./AdminDialog";
import { FormSectionNav } from "./FormSectionNav";
import { DialogFooter } from "./DialogFooter";
import type { MutationResult } from "../services/mutation";
import { FormFeedback } from "./FormFeedback";
import type {
  Doctor,
  DoctorCategory,
} from "@/features/doctors/types/doctor.type";
import { upsertDoctor } from "../actions";
import { ImageUploadField } from "./ImageUploadField";
import { EditableRows } from "./EditableRows";
import { showMutationToast, useMutationToast } from "./AdminToast";
import { LazyEditDialog } from "./LazyEditDialog";
import { getAdminDoctorForEdit } from "../read-actions";

const CATEGORIES: { label: string; value: DoctorCategory }[] = [
  { label: "Cấy Ghép Implant", value: "implant" },
  { label: "Chỉnh Nha - Niềng Răng", value: "ortho" },
  { label: "Răng Sứ & Thẩm Mỹ", value: "aesthetic" },
  { label: "Phẫu Thuật Hàm Mặt & Nha Chu", value: "surgery" },
  { label: "Nha Khoa Trẻ Em & Tổng Quát", value: "pediatric" },
];

const defaultButtonClassName = "rounded-xl border border-border-subtle bg-white px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm";

// With doctorId the full profile is fetched on click; without it the dialog adds a new doctor.
export function DoctorFormDialog({ doctorId, buttonLabel = "Sửa", buttonClassName = defaultButtonClassName }: { doctorId?: string; buttonLabel?: string; buttonClassName?: string }) {
  if (!doctorId) return <DoctorEditor buttonClassName={buttonClassName} buttonLabel={buttonLabel} />;
  return (
    <LazyEditDialog buttonClassName={buttonClassName} buttonLabel={buttonLabel} load={() => getAdminDoctorForEdit(doctorId)}>
      {(doctor, close) => <DoctorEditor defaultOpen doctor={doctor} onClose={close} />}
    </LazyEditDialog>
  );
}

function DoctorEditor({
  doctor,
  defaultOpen = false,
  onClose,
  buttonLabel = "Sửa",
  buttonClassName = defaultButtonClassName,
}: {
  doctor?: Doctor;
  defaultOpen?: boolean;
  onClose?: () => void;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const close = () => { setIsOpen(false); onClose?.(); };
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MutationResult | null>(null);
  useMutationToast(result, doctor ? "Đã cập nhật hồ sơ bác sĩ." : "Đã thêm bác sĩ.");

  const [formData, setFormData] = useState({
    id: doctor?.id ?? "",
    name: doctor?.name ?? "",
    slug: doctor?.slug ?? "",
    avatar: doctor?.avatar ?? "",
    position: doctor?.position ?? "",
    experience: doctor?.experience ?? 10,
    sortOrder: doctor?.sortOrder ?? 0,
    degree: doctor?.degree ?? "",
    description: doctor?.description ?? "",
    badge: doctor?.badge ?? "Bác sĩ",
    highlight: doctor?.highlight ?? "Hơn 10 năm kinh nghiệm",
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
        // Success toasts directly: closing unmounts this editor before the result effect could run.
        if (saved.success) { showMutationToast(saved, doctor ? "Đã cập nhật hồ sơ bác sĩ." : "Đã thêm bác sĩ."); close(); }
        else setResult(saved);
      } catch { setResult({ success: false, error: "Không thể lưu thay đổi. Vui lòng thử lại." }); }
    });
  };

  return (
    <>
      {defaultOpen ? null : <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClassName}
      >
        {buttonLabel}
      </button>}

      <AdminDialog icon="badge" onOpenChange={(open) => { if (!open) (close)(); }} open={isOpen} size="xl" title={doctor ? "Chỉnh sửa Hồ Sơ Bác Sĩ" : "Thêm Bác Sĩ Mới"}>
            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm sm:px-7">
              <FormSectionNav />
              <FormFeedback result={result} />

              <fieldset className="admin-form-section" data-nav="Thẻ bác sĩ">
                <legend>Hiển thị trên thẻ bác sĩ</legend>
                <p className="admin-form-hint">Thẻ hiển thị theo thứ tự: Học vị, Họ và tên, Chức vị (nếu có), Chuyên môn.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
                  <ImageUploadField aspect={1} label="Ảnh chân dung *" onChange={(avatar) => setFormData({ ...formData, avatar })} required value={formData.avatar} />
                  <div className="flex flex-col gap-4">
                    <label>Học vị<input maxLength={60} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="THẠC SĨ, BÁC SĨ CKII" type="text" value={formData.degree} /></label>
                    <label>Họ và tên *<input onChange={handleNameChange} placeholder="Võ Văn Tự Hiến" required type="text" value={formData.name} /></label>
                    <label>Chức vị (nếu có)<input onChange={(e) => setFormData({ ...formData, position: e.target.value })} placeholder="Giám đốc chuyên môn Cơ sở 1" type="text" value={formData.position} /></label>
                    <label>Chuyên môn<input onChange={(e) => setFormData({ ...formData, directoryTitle: e.target.value })} placeholder="Implant & Phẫu thuật miệng" type="text" value={formData.directoryTitle} /></label>
                  </div>
                </div>
              </fieldset>

              <fieldset className="admin-form-section" data-nav="Giới thiệu">
                <legend>Giới thiệu trên trang hồ sơ</legend>
                <label>Mô tả kinh nghiệm *<textarea onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Hơn 15 năm kinh nghiệm phục hình dán sứ vi phẫu..." required rows={3} value={formData.description} /></label>
                <label>Trích dẫn y đức (không bắt buộc)<textarea onChange={(e) => setFormData({ ...formData, quote: e.target.value })} rows={2} value={formData.quote} /></label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label>Số năm kinh nghiệm *<input min="0" onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })} required type="number" value={formData.experience} /></label>
                  <label>Điểm nổi bật<input onChange={(e) => setFormData({ ...formData, highlight: e.target.value })} placeholder="Hơn 35 năm kinh nghiệm" type="text" value={formData.highlight} /></label>
                  <label>Số chứng chỉ hành nghề<input onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="010749/HCM-CCHN" type="text" value={formData.licenseNumber} /></label>
                </div>
              </fieldset>

              <fieldset className="admin-form-section" data-nav="Hồ sơ">
                <legend>Hồ sơ chuyên môn</legend>
                <EditableRows label="Chuyên môn chi tiết * (ít nhất 1 dòng)" columns={[{ key: "value", label: "Nội dung", multiline: true }]} value={formData.specialties.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, specialties: rows.map((row) => row.value) })} />
                <EditableRows label="Học vấn và đào tạo" columns={[{ key: "value", label: "Nội dung", multiline: true }]} value={formData.education.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, education: rows.map((row) => row.value) })} />
                <EditableRows label="Kinh nghiệm nổi bật" columns={[{ key: "value", label: "Nội dung", multiline: true }]} value={formData.experienceHighlights.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, experienceHighlights: rows.map((row) => row.value) })} />
                <EditableRows label="Chứng chỉ và bằng cấp" columns={[{ key: "title", label: "Tên chứng chỉ" }, { key: "issuer", label: "Đơn vị cấp" }, { key: "detail", label: "Chi tiết", multiline: true }, { key: "image", label: "Ảnh chứng chỉ", image: true }]} value={formData.certificates} onChange={(rows) => setFormData({ ...formData, certificates: rows.map((row) => ({ title: row.title, issuer: row.issuer, detail: row.detail, image: row.image })) })} />
                <EditableRows label="Ngôn ngữ" columns={[{ key: "value", label: "Nội dung" }]} value={formData.languages.map((value) => ({ value }))} onChange={(rows) => setFormData({ ...formData, languages: rows.map((row) => row.value) })} />
              </fieldset>

              <fieldset className="admin-form-section" data-nav="Hiển thị">
                <legend>Lọc và sắp xếp trên trang Bác sĩ</legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label>Nhóm chuyên môn (bộ lọc) *
                    <select onChange={(e) => setFormData({ ...formData, category: e.target.value as DoctorCategory })} value={formData.category}>
                      {CATEGORIES.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                    </select>
                  </label>
                  <label>Thứ tự hiển thị<input max="99999" min="0" onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} step="1" type="number" value={formData.sortOrder} /></label>
                </div>
                <p className="admin-form-hint">Số nhỏ hiển thị trước.</p>
              </fieldset>

              <details className="admin-form-section" data-nav="Nâng cao">
                <summary>Cài đặt nâng cao</summary>
                <label>Đường dẫn trang (slug) *<input className="font-mono" onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="vo-van-tu-hien" required type="text" value={formData.slug} /></label>
                <p className="admin-form-hint">Tự tạo từ họ tên khi thêm mới. Đổi slug sẽ làm đường dẫn cũ /bac-si/… không còn hoạt động.</p>
                <label>URL nguồn hồ sơ<input onChange={(event) => setFormData({ ...formData, sourceUrl: event.target.value })} type="url" value={formData.sourceUrl} /></label>
              </details>

              <DialogFooter isPending={isPending} onCancel={() => close()} submitLabel="Lưu Bác Sĩ" />
            </form>
      </AdminDialog>
    </>
  );
}
