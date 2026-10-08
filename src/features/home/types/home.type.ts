export type HeroSlide = {
  id: string;
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  badgeVariant: "blue" | "green";
  objectPosition?: "center" | "top";
};

export type CoreValue = {
  title: string;
  slogan: string;
  description: string;
  iconKey: "heart" | "care" | "honesty" | "innovation";
};

export type FAQItem = { question: string; answer: string };

export type InsurancePartner = {
  code: string;
  name: string;
  description: string;
  accent: "blue" | "green";
  logoSrc?: string;
};

export type Testimonial = {
  id: string;
  customerName: string;
  rating: number;
  content: string;
  avatar?: string;
  source?: string;
  initials: string;
  accent: "blue" | "green" | "blue-dark";
};
