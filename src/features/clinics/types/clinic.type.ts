export type Clinic = {
  id: string;
  name: string;
  slug: string;
  label: string;
  badge: string;
  address: string;
  phone: string;
  image: string;
  description: string;
  workingHours: string;
  facilities: readonly string[];
  googleMapsUrl?: string;
  accent: "blue" | "green";
};

export type ClinicSummary = { name: string; description: string; address: string };
