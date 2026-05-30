import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sayapatri – Authentic Nepali Restaurant Dubai",
  description:
    "Experience authentic Nepali cuisine at Sayapatri. Order online for delivery or pickup from our 4 branches across Dubai.",
  keywords: "Nepali restaurant Dubai, Nepali food Dubai, Dal Bhat Dubai, Momo Dubai, order Nepali food online",
  openGraph: {
    title: "Sayapatri – Authentic Nepali Restaurant Dubai",
    description: "Order authentic Nepali food online. Delivery across Dubai.",
    url: "https://sayapatristar.com",
    siteName: "Sayapatri",
    locale: "en_AE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#FDF6E3",
              borderRadius: "12px",
              padding: "14px 20px",
            },
          }}
        />
      </body>
    </html>
  );
}
