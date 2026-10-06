import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100, "Họ tên không được vượt quá 100 ký tự"),
  phone: z.string().trim().regex(/^(?:\+84|0)\d{9}$/, "Số điện thoại không hợp lệ"),
  email: z.union([z.email("Email không hợp lệ"), z.literal("")]).optional().transform((value) => value || undefined),
  serviceId: z.string().trim().max(100).optional().transform((value) => value || undefined),
  appointmentDate: z.string().trim().min(1, "Vui lòng chọn ngày hẹn").refine((value) => !Number.isNaN(Date.parse(value)), "Ngày hẹn không hợp lệ"),
  note: z.string().trim().max(1000, "Ghi chú không được vượt quá 1000 ký tự").optional().transform((value) => value || undefined),
});

export type AppointmentSchemaInput = z.input<typeof appointmentSchema>;
