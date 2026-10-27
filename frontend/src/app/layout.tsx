import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vista Hermosa Beauty Salon",
  description: "Beauty salon services in Vista Hermosa, Michoacan De Ocampo, Mexico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} antialiased`}
      >
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
        <ScrollReveal />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
