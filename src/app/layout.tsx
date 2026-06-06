import type { Metadata } from "next";
import { Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni-tech-shop.vercel.app"
  ),
  title: {
    default: "Omni Tech | Catálogo Tecnológico",
    template: "%s | Omni Tech",
  },
  description:
    "Catálogo de productos tecnológicos: componentes, periféricos, monitores, almacenamiento y más. Consultá y comprá con asesoramiento personalizado.",
  keywords: [
    "tecnología",
    "componentes pc",
    "periféricos",
    "monitores",
    "hardware",
    "argentina",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Omni Tech",
    title: "Omni Tech | Catálogo Tecnológico",
    description:
      "Explorá nuestro catálogo de productos tecnológicos con asesoramiento personalizado.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Omni Tech" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${orbitron.variable}`}>
      <body className="min-h-screen flex flex-col bg-gray-50 font-body">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
