"use client";

import { useState, useTransition } from "react";
import { AdminDialog } from "./AdminDialog";
import { DialogFooter } from "./DialogFooter";
import type { Clinic } from "@/features/clinics/types/clinic.type";
import { updateClinic } from "../actions";
import { showAdminToast } from "./AdminToast";
import { ImageUploadField } from "./ImageUploadField";

export function ClinicFormDialog({ clinic }: { clinic: Clinic }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    id: clinic.id,
    name: clinic.name,
    address: clinic.address,
    phone: clinic.phone,
    workingHours: clinic.workingHours,
    description: clinic.description,
    image: clinic.image,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await updateClinic(formData);
        if (!result.success) throw new Error(result.error || "Không thể cập nhật cơ sở.");
        showAdminToast("success", "Đã cập nhật thông tin cơ sở.");
        setIsOpen(false);
      } catch (error) {
        if (error instanceof Error && error.message) {
          showAdminToast("error", error.message);
          return;
        }
        showAdminToast("error", "Không thể cập nhật cơ sở. Vui lòng thử lại.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl border border-border-subtle bg-white px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-container-low transition-colors shadow-sm"
      >
        Chỉnh sửa thông tin
      </button>

      <AdminDialog icon="apartment" onOpenChange={(open) => { if (!open) setIsOpen(false); }} open={isOpen} size="md" title={`Chỉnh sửa ${clinic.name}`}>
            <form onSubmit={handleSubmit} className="admin-dialog-form min-h-0 flex-1 flex flex-col gap-5 overflow-y-auto px-5 py-5 text-sm text-left sm:px-7">
              <div>
                <ImageUploadField
                  aspect={16 / 9}
                  label="Ảnh cơ sở *"
                  onChange={(image) => setFormData((current) => ({ ...current, image }))}
                  required
                  value={formData.image}
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Tên cơ sở *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Địa chỉ đầy đủ *</label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Số điện thoại / Hotline *</label>
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary font-mono focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Giờ làm việc *</label>
                  <input
                    required
                    type="text"
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Mô tả giới thiệu cơ sở</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-border-subtle bg-background-secondary px-3.5 py-2 text-text-primary focus:border-brand-blue-dark focus:bg-white focus:outline-none"
                />
              </div>

              <DialogFooter isPending={isPending} onCancel={() => setIsOpen(false)} submitLabel="Lưu Cơ Sở" />
            </form>
      </AdminDialog>
    </>
  );
}
