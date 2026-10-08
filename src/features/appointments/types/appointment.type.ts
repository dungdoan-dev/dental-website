export type AppointmentInput = {
  name: string;
  phone: string;
  email?: string;
  serviceId?: string;
  doctorId?: string;
  clinicId: string;
  appointmentDate: string;
  note?: string;
};

export type AppointmentClinicOption = Pick<import("@/features/clinics/types/clinic.type").Clinic, "id" | "label" | "address">;

export type AppointmentResult = {
  success: true;
  message: string;
};
