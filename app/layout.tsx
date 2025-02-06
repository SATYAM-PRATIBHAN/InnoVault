import type { Metadata } from "next";
import { Geist, Geist_Mono, Jura } from "next/font/google";
import "./globals.css";

const jura = Jura({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
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
  title: "InnoVault",
  description: " A Community-Driven Idea Vault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jura.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
        
      </body>
    </html>
  );
}
