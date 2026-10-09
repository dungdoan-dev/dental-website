export type DoctorCategory = "implant" | "ortho" | "aesthetic" | "surgery" | "pediatric";

export type DoctorCertificate = {
  title: string;
  issuer: string;
  detail: string;
  image: string;
};

export type DoctorProfile = {
  licenseNumber: string;
  quote: string;
  specialties: readonly string[];
  languages: readonly string[];
  education: readonly string[];
  experienceHighlights: readonly string[];
  certificates: readonly DoctorCertificate[];
  sourceUrl: string;
};

export type Doctor = {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  position: string;
  specialty: string;
  experience: number;
  sortOrder: number;
  description: string;
  badge: string;
  highlight: string;
  category: DoctorCategory;
  directoryTitle: string;
  profile?: DoctorProfile;
};
