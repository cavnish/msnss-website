import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://msnss.com"),
  title: {
    default:
      "MSNSS – MS & SS HVAC Duct Manufacturer, Fabricator & Installer | Vasai",
    template: "%s | MSNSS – M S HVAC Engineers",
  },
  description:
    "MSNSS makes, fabricates and installs MS & SS HVAC ducting. 25+ years experience, 2,000 SQM/month capacity in Vasai. SMACNA, DW 144 & IS 655 standards. Get a quote today.",
  keywords: [
    "HVAC duct manufacturer",
    "MS ducting",
    "SS ducting",
    "duct fabrication Vasai",
    "duct installation Mumbai",
    "fire rated duct coating",
    "kitchen exhaust duct",
    "SMACNA ducting",
  ],
  openGraph: {
    title: "MSNSS – MS & SS HVAC Duct Manufacturer, Fabricator & Installer",
    description:
      "Precision ducting. Reliable execution. MS & SS HVAC ducting made, fabricated and installed for your project.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-white text-ink antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MSNSS – M S HVAC Engineers",
              url: "https://msnss.com",
              email: "sales@msnss.com",
              telephone: "+91 702 109 4388",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Gala No. O-003/002, Khan Compound, Western Express Highway",
                addressLocality: "Vasai",
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
