import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { FloatingContactActions } from "@/components/common/FloatingContactActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TopBar } from "@/components/layout/TopBar";
import { generateSeoMetadata } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = generateSeoMetadata();

const manrope = Manrope({ subsets: ["latin", "vietnamese"], display: "swap" });

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body className={`${manrope.className} bg-surface text-on-surface antialiased`}>
        <TopBar />
        <Header />
        <main className="min-h-[60vh] pt-[114px]">{children}</main>
        <Footer />
        <FloatingContactActions />
      </body>
    </html>
  );
}
