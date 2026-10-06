import type { ArticleCategory } from "../types/article.type";

export const articleCategories: readonly { value: "all" | ArticleCategory; label: string }[] = [
  { value: "all", label: "Tất Cả" },
  { value: "implant", label: "Trồng Răng Implant" },
  { value: "veneer", label: "Răng Sứ Thẩm Mỹ" },
  { value: "orthodontics", label: "Niềng Răng - Chỉnh Nha" },
  { value: "kids", label: "Nha Khoa Trẻ Em" },
  { value: "periodontics", label: "Bệnh Lý & Nướu" },
  { value: "general", label: "Chăm Sóc Răng Miệng" },
];

export function getArticleCategoryLabel(category: ArticleCategory): string {
  return articleCategories.find((item) => item.value === category)?.label ?? "Kiến Thức Nha Khoa";
}
