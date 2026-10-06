export type ServiceCategory =
  | "implant"
  | "aesthetic"
  | "orthodontics"
  | "general"
  | "surgery";

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
