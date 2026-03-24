import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AppQueryClientProvider } from "./query-client-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tinkerfly.lk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tinkerfly - Elegant Bouquets for Every Occasion",
    template: "%s | Tinkerfly",
  },
  description:
    "Premium bouquets, teddy bouquets, chocolate bouquets, and custom flower arrangements with islandwide delivery across Sri Lanka.",
  keywords: [
    "Tinkerfly",
    "bouquet delivery Sri Lanka",
    "flower shop Sri Lanka",
    "teddy bouquet",
    "chocolate bouquet",
    "custom bouquet",
    "gift delivery",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tinkerfly",
    title: "Tinkerfly - Elegant Bouquets for Every Occasion",
    description:
      "Premium bouquets and custom gift arrangements with islandwide delivery across Sri Lanka.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Tinkerfly Floral Gifts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tinkerfly - Elegant Bouquets for Every Occasion",
    description:
      "Premium bouquets and custom gift arrangements with islandwide delivery across Sri Lanka.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: "Tinkerfly",
    url: siteUrl,
    image: `${siteUrl}/logo.png`,
    telephone: "+94 72 250 7196",
    areaServed: "Sri Lanka",
    sameAs: [
      "https://www.facebook.com/share/1ZmfzmjiVG/",
      "https://www.instagram.com/tinkerfly_?igsh=MTlxejA5MGtldmZ4Nw==",
      "https://www.tiktok.com/@tinkerfly__?_r=1&_t=ZS-948RviYPT4H",
    ],
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AppQueryClientProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </AppQueryClientProvider>
      </body>
    </html>
  );
}



