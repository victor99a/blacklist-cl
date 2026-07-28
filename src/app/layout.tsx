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
  title: "BLACKLIST.CL // SANTIAGO CHILE",
  description:
    "Plataforma y garaje virtual para la comunidad tuerca en Chile. Documenta tu build, reseña talleres, sube en el ranking nacional.",
  openGraph: {
    title: "BLACKLIST.CL // SANTIAGO CHILE",
    description:
      "Plataforma y garaje virtual para la comunidad tuerca en Chile.",
    siteName: "Blacklist.cl",
    locale: "es_CL",
    type: "website",
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
