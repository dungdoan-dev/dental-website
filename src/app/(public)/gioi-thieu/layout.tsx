import type { ReactNode } from "react";
import { AboutLightboxProvider } from "@/features/about/components/AboutLightbox";
import { AboutSubnav } from "@/features/about/components/AboutSubnav";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <AboutLightboxProvider>
      <AboutSubnav />
      {children}
    </AboutLightboxProvider>
  );
}
