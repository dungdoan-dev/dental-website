import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const requiredText = (max: number) => text(max).min(1, "Vui lòng nhập trường này.");

export const serviceDetailSchema = z.object({
  eyebrow: text(120).default(""),
  title: requiredText(240),
  introduction: requiredText(10000),
  highlights: z.array(requiredText(500)).max(30),
  priceSourceUrl: z.union([z.literal(""), z.url().max(2000)]),
  prices: z.array(z.object({ name: requiredText(240), detail: text(2000), price: text(200) })).max(100),
  steps: z.array(z.object({ number: text(20), title: requiredText(240), description: requiredText(3000) })).max(30),
  faqs: z.array(z.object({ question: requiredText(500), answer: requiredText(5000) })).max(50),
});

export type ServiceDetailData = z.infer<typeof serviceDetailSchema>;

export function serviceDetailContentKey(serviceId: string) {
  return `service_detail_${serviceId}`;
}
