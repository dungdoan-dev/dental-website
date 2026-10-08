import { z } from "zod";

export const implantDetailSchema = z.object({
  priceSourceUrl: z.url(),
  prices: z.array(z.object({ name: z.string(), detail: z.string(), price: z.string() })),
  steps: z.array(z.object({ number: z.string(), title: z.string(), description: z.string() })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export type ImplantDetailData = z.infer<typeof implantDetailSchema>;
