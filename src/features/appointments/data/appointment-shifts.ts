export const appointmentShiftIds = ["morning", "afternoon", "evening"] as const;

export type AppointmentShiftId = (typeof appointmentShiftIds)[number];

export const appointmentShifts = [
  { id: "morning", label: "Sáng", hours: "08:00 - 12:00", startsAt: "08:00" },
  { id: "afternoon", label: "Chiều", hours: "13:30 - 17:00", startsAt: "13:30" },
  { id: "evening", label: "Tối", hours: "17:00 - 20:00", startsAt: "17:00" },
] as const satisfies readonly { id: AppointmentShiftId; label: string; hours: string; startsAt: string }[];
