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
  description:
    "InnoVault is an open-source platform where developers share, upvote, and collaborate on project ideas. Start innovating now!",
  openGraph: {
    title: "InnoVault",
    description:
      "InnoVault is an open-source platform where developers share, upvote, and collaborate on project ideas.",
    url: "https://yourdomain.com",
    images: [
      {
        url: "/ss.png", // Reference the image in the public folder
        width: 1200,
        height: 630,
        alt: "InnoVault - Open Source Idea Vault",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InnoVault",
    description:
      "InnoVault is an open-source platform where developers share, upvote, and collaborate on project ideas.",
    images: ["/ss.png"], // Reference the image in the public folder
  },
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
