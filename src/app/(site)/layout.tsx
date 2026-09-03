import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { ScrollProgress } from "@/components/motion/Motion";
import { TrustedClientsSection } from "@/components/TrustedClientsSection";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <TrustedClientsSection />
      <Footer />
      <FloatingActions />
    </>
  );
}
