import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type SeoMetadataInput = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export function generateSeoMetadata({ title, description = siteConfig.description, image, url }: SeoMetadataInput = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: fullTitle,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url,
      images: image ? [{ url: image }] : undefined,
    },
  };
}
