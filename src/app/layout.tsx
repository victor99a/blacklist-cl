import type { Metadata } from "next";
import { Oswald, Titillium_Web } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-titillium",
});

export const metadata: Metadata = {
  title: {
    default: "BLACK LIST CHILE // El Garaje Virtual & Ranking Automotriz",
    template: "%s // BLACK LIST CHILE",
  },
  description:
    "El garaje virtual de la comunidad tuerca chilena. Sube tu build, rese\u00F1a talleres y compite en el ranking nacional.",
  openGraph: {
    title: "BLACK LIST CHILE // El Garaje Virtual & Ranking Automotriz",
    description:
      "El garaje virtual de la comunidad tuerca chilena. Sube tu build, rese\u00F1a talleres y compite en el ranking nacional.",
    siteName: "Blacklist.cl",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BLACK LIST CHILE // El Garaje Virtual",
    description:
      "El garaje virtual de la comunidad tuerca chilena.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${titillium.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-nfs-bg font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
