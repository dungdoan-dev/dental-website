"use client";

import { useEffect, useRef } from "react";
import type { MutationResult } from "../services/mutation";

// Field keys come from the zod schemas (path joined by "."); show the first segment as a Vietnamese label.
const FIELD_LABELS: Record<string, string> = {
  id: "Mã", name: "Tên", slug: "Đường dẫn (slug)", title: "Tiêu đề", description: "Mô tả", shortDescription: "Mô tả ngắn",
  image: "Ảnh", avatar: "Ảnh chân dung", thumbnail: "Ảnh đại diện", badge: "Nhãn", category: "Danh mục", question: "Câu hỏi",
  answer: "Câu trả lời", excerpt: "Tóm tắt", content: "Nội dung", author: "Tác giả", readingMinutes: "Thời gian đọc",
  degree: "Học vị", position: "Chức vụ", experience: "Số năm kinh nghiệm", sortOrder: "Thứ tự", highlight: "Điểm nổi bật",
  directoryTitle: "Chuyên môn", licenseNumber: "Số chứng chỉ hành nghề", quote: "Trích dẫn", languages: "Ngôn ngữ",
  sourceUrl: "URL nguồn", education: "Học vấn", specialties: "Chuyên môn chi tiết", experienceHighlights: "Kinh nghiệm nổi bật",
  certificates: "Chứng chỉ", customerName: "Tên khách hàng", rating: "Điểm đánh giá", initials: "Chữ viết tắt", accent: "Màu",
  address: "Địa chỉ", phone: "Số điện thoại", workingHours: "Giờ làm việc", imageAlt: "Mô tả ảnh", status: "Trạng thái",
};

function fieldLabel(path: string) {
  const [first, ...rest] = path.split(".");
  const label = FIELD_LABELS[first] ?? first;
  return rest.length && /^\d+$/.test(rest[0]) ? `${label} (mục ${Number(rest[0]) + 1})` : label;
}

export function FormFeedback({ result }: { result: MutationResult | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (result && !result.success) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [result]);

  if (!result) return null;
  if (result.success) return <p aria-live="polite" className="rounded-xl bg-brand-green-light p-3 text-sm font-medium text-text-primary">Đã lưu thay đổi.</p>;
  return <div className="rounded-xl border border-error/25 bg-error-container/30 p-4 text-sm text-error" ref={ref} role="alert">
    <p className="font-semibold">{result.error}</p>
    {result.fieldErrors && <ul className="mt-2 list-inside list-disc space-y-0.5">{Object.entries(result.fieldErrors).map(([field, message]) => <li key={field}><strong className="font-semibold">{fieldLabel(field)}:</strong> {message}</li>)}</ul>}
  </div>;
}
