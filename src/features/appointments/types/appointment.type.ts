export type AppointmentInput = {
  name: string;
  phone: string;
  email?: string;
  serviceId?: string;
  appointmentDate: string;
  note?: string;
};

export type AppointmentResult = {
  success: true;
  message: string;
};
