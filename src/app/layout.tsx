import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { generateSeoMetadata } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = generateSeoMetadata();
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f9ff",
};
// Public routes can be statically rendered and refreshed on the same cadence
// as the tagged public-data cache. Routes using cookies/headers remain dynamic.
export const revalidate = 300;

const manrope = Manrope({ subsets: ["latin", "vietnamese"], display: "swap" });

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body className={`${manrope.className} bg-surface text-on-surface antialiased`}>
        {children}
      </body>
    </html>
  );
}
