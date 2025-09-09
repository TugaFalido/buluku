import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";


const gliker = localFont({
  src: "../fonts/Gliker-Bold.ttf",
  variable: "--font-gliker",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
      title: "Buluku",
      description: "O afronauta doidão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gliker.className} bg-[#0b0e17] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
