import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function getSiteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url);
}

type SeoMetadataInput = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export function generateSeoMetadata({ title, description = siteConfig.description, image, url }: SeoMetadataInput = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metadataBase = getSiteUrl();
  const canonicalUrl = url ? new URL(url, metadataBase).toString() : undefined;
  return {
    metadataBase,
    title: fullTitle,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: canonicalUrl,
      images: image ? [{ url: image }] : undefined,
    },
  };
}
