export type ServiceCategory =
  | "pediatric"
  | "general"
  | "aesthetic"
  | "orthodontics"
  | "implant"
  | "periodontics"
  | "other";

export type DentalService = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  badge: string;
  badgeVariant: "blue" | "green";
  featured: boolean;
  category: ServiceCategory;
};
