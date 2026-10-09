"use client";

import Cropper, { type Area } from "react-easy-crop";
import Image from "next/image";
import { useState } from "react";

async function createCroppedImage(image: string, area: Area): Promise<Blob> {
  const source = new window.Image();
  source.src = image;
  await new Promise<void>((resolve, reject) => {
    source.onload = () => resolve();
    source.onerror = () => reject(new Error("Không thể đọc ảnh đã chọn."));
  });
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Không thể tạo ảnh đã cắt.")), "image/jpeg", 0.9));
}

export function ImageUploadField({
  value: controlledValue,
  defaultValue = "",
  onChange,
  label = "Ảnh",
  aspect = 4 / 3,
  name,
  required = false,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (path: string) => void;
  label?: string;
  aspect?: number;
  name?: string;
  required?: boolean;
}) {
  const [localValue, setLocalValue] = useState(controlledValue ?? defaultValue);
  const value = controlledValue ?? localValue;
  const [source, setSource] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function updateValue(path: string) {
    setLocalValue(path);
    onChange?.(path);
  }

  function chooseFile(file?: File) {
    setError("");
    if (!file) return;
    if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
      setError("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Ảnh gốc không được vượt quá 12 MB.");
      return;
    }
    setSource(URL.createObjectURL(file));
    setZoom(1);
  }

  async function uploadCroppedImage() {
    if (!source || !area) return;
    setBusy(true);
    setError("");
    try {
      const blob = await createCroppedImage(source, area);
      const body = new FormData();
      body.append("file", blob, "cropped-image.jpg");
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = await response.json() as { path?: string; error?: string };
      if (!response.ok || !result.path) throw new Error(result.error || "Tải ảnh lên thất bại.");
      updateValue(result.path);
      URL.revokeObjectURL(source);
      setSource("");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Tải ảnh lên thất bại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block font-semibold text-text-primary">{label}</label>
      <div className="flex flex-wrap items-center gap-3">
        {value ? <Image alt="Ảnh hiện tại" className="h-16 w-24 rounded-lg border border-border-subtle object-cover" height={64} src={value} unoptimized width={96} /> : null}
        <label className="inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-border-subtle px-3 text-xs font-semibold text-brand-blue-dark hover:bg-brand-blue-light">
          Chọn và cắt ảnh
          <input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { chooseFile(event.target.files?.[0]); event.currentTarget.value = ""; }} type="file" />
        </label>
      </div>
      <input aria-label={`${label} URL hoặc đường dẫn`} className="w-full rounded-lg border border-border-subtle bg-background-secondary px-3 py-2 font-mono text-xs text-text-primary" name={name} onChange={(event) => updateValue(event.target.value)} placeholder="Hoặc dán URL/đường dẫn ảnh" required={required} value={value} />
      {error ? <p className="text-xs text-red-600" role="alert">{error}</p> : null}
      {source ? (
        <div aria-label="Cắt ảnh" aria-modal="true" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" role="dialog">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4">
            <div className="relative h-[min(60vh,480px)] overflow-hidden rounded-xl bg-slate-950">
              <Cropper image={source} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, pixels) => setArea(pixels)} />
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm">Phóng to
              <input className="w-full accent-sky-600" min={1} max={3} onChange={(event) => setZoom(Number(event.target.value))} step={0.1} type="range" value={zoom} />
            </label>
            {error ? <p className="mt-2 text-sm text-red-600" role="alert">{error}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <button className="min-h-10 rounded-lg border border-border-subtle px-4 text-sm" disabled={busy} onClick={() => { URL.revokeObjectURL(source); setSource(""); }} type="button">Hủy</button>
              <button className="min-h-10 rounded-lg bg-brand-blue-dark px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || !area} onClick={uploadCroppedImage} type="button">{busy ? "Đang tải ảnh…" : "Cắt và tải lên"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
