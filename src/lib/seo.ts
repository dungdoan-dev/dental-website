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
      siteName: siteConfig.name,
      locale: "vi_VN",
      // Pages without their own image share the team photo so Facebook/Zalo previews are never blank.
      images: [image ? { url: image } : { url: "/og-default.jpg", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Absolute URL for JSON-LD, which (unlike <meta>) does not resolve paths against metadataBase. */
export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
