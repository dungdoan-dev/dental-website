import { serviceGroups } from "./service-filter.data";
import type { ServicePriceCategories } from "../schemas/service-price-categories.schema";

export const defaultServicePriceCategories: ServicePriceCategories = {
  title: "Bảng giá theo danh mục kĩ thuật",
  description: "Chi phí chính xác sẽ được bác sĩ tư vấn sau khi thăm khám.",
  rows: serviceGroups.map(({ value, label }) => ({ category: value, label, price: "Liên hệ tư vấn" })),
};
