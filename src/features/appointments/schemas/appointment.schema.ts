import { z } from "zod";
import { appointmentShiftIds } from "../data/appointment-shifts";

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100, "Họ tên không được vượt quá 100 ký tự"),
  phone: z.string().trim().regex(/^\+[1-9]\d{7,14}$/, "Số điện thoại quốc tế không hợp lệ"),
  email: z.union([z.email("Email không hợp lệ"), z.literal("")]).optional().transform((value) => value || undefined),
  serviceId: z.string().trim().max(100).optional().transform((value) => value || undefined),
  doctorId: z.string().trim().max(100).optional().transform((value) => value || undefined),
  clinicId: z.string().trim().min(1, "Vui lòng chọn cơ sở thăm khám").max(100, "Cơ sở thăm khám không hợp lệ"),
  appointmentDate: z.string().trim().min(1, "Vui lòng chọn ngày hẹn").refine((value) => !Number.isNaN(Date.parse(value)), "Ngày hẹn không hợp lệ"),
  preferredShift: z.enum(appointmentShiftIds).optional(),
  note: z.string().trim().max(1000, "Ghi chú không được vượt quá 1000 ký tự").optional().transform((value) => value || undefined),
});

export type AppointmentSchemaInput = z.input<typeof appointmentSchema>;
