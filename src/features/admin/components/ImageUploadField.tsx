"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useId, useRef, useState, type ComponentType } from "react";
import type { Area } from "react-easy-crop";
import { ImagePlus, Upload } from "lucide-react";
import { Button } from "@/components/admin-ui/button";

// Loaded only when the crop dialog opens, so pages with image fields do not ship the cropper up front.
type Point = { x: number; y: number };
type CropperProps = { image: string; crop: Point; zoom: number; aspect: number; onCropChange: (crop: Point) => void; onZoomChange: (zoom: number) => void; onCropComplete: (area: Area, pixels: Area) => void };
// dynamic() drops the library's defaultProps typing, so the props this file passes are declared here.
const Cropper = dynamic(() => import("react-easy-crop") as unknown as Promise<{ default: ComponentType<CropperProps> }>, { ssr: false });

async function createCroppedImage(image: string, area: Area): Promise<Blob> {
  const source = new window.Image();
  source.src = image;
  await new Promise<void>((resolve, reject) => {
    source.onload = () => resolve();
    source.onerror = () => reject(new Error("Không thể đọc ảnh đã chọn."));
  });
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 2560 / Math.max(area.width, area.height));
  canvas.width = Math.max(1, Math.round(area.width * scale));
  canvas.height = Math.max(1, Math.round(area.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(source, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Không thể tạo ảnh đã cắt.")), "image/webp", 0.9));
}

export function ImageUploadField({
  value: controlledValue,
  defaultValue = "",
  onChange,
  label = "Ảnh",
  aspect = 4 / 3,
  fit = "cover",
  name,
  required = false,
}: {
  value?: string;
  defaultValue?: string;
  onChange?: (path: string) => void;
  label?: string;
  aspect?: number;
  fit?: "cover" | "contain";
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
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);

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
      body.append("file", blob, "cropped-image.webp");
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
    <div className="space-y-2.5">
      <label htmlFor={`${id}-file`}>{label}{required && !label.includes("*") ? " *" : ""}</label>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-border-subtle bg-background-secondary p-4">
        {value ? <Image alt={label.replace(/\s*\*$/, "")} className={`h-20 w-28 shrink-0 rounded-lg border border-border-subtle bg-white ${fit === "contain" ? "object-contain p-2" : "object-cover"}`} height={80} src={value} unoptimized width={112} /> : <span className="grid h-20 w-28 shrink-0 place-items-center rounded-lg border border-border-subtle bg-white text-text-secondary"><ImagePlus aria-hidden="true" className="size-7" strokeWidth={1.5} /></span>}
        <div className="min-w-[9rem] flex-1 space-y-2">
          <Button className="min-h-11" onClick={() => fileInput.current?.click()} type="button" variant="outline"><Upload aria-hidden="true" />{value ? "Thay ảnh" : "Chọn ảnh"}</Button>
          {value && !required ? <Button aria-label={`Gỡ ${label}`} className="ml-2 min-h-11 text-error" onClick={() => updateValue("")} type="button" variant="ghost">Gỡ ảnh</Button> : null}
          <p className="text-xs font-normal leading-relaxed text-text-secondary">JPG, PNG hoặc WebP · Tối đa 12 MB<br />Cắt ảnh theo tỉ lệ trước khi tải lên.</p>
        </div>
        <input accept="image/jpeg,image/png,image/webp" aria-describedby={error ? `${id}-error` : undefined} aria-label={`Chọn tệp ${label}`} className="sr-only" id={`${id}-file`} onChange={(event) => { chooseFile(event.target.files?.[0]); event.currentTarget.value = ""; }} ref={fileInput} tabIndex={-1} type="file" />
      </div>
      {name ? <input name={name} type="hidden" value={value} /> : null}
      {error ? <p className="text-xs text-error" id={`${id}-error`} role="alert">{error}</p> : null}
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
