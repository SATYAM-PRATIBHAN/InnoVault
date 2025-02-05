import type { Metadata } from "next";
import { Geist, Geist_Mono, Jura } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/main/navbar";
import Footer from "@/components/main/footer";
import { BackgroundLines } from "@/components/ui/background-lines";

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
        <div className="flex flex-col min-h-screen">
        <Navbar/>
          <BackgroundLines>
            <main className="flex-grow"> {/* This ensures the main content takes up all available space */}
              {children}
            </main>
          </BackgroundLines>
        <Footer
        githubUrl="https://github.com/SATYAM-PRATIBHAN"
        linkedinUrl="https://www.linkedin.com/in/satyampratibhan/"
        twitterUrl="https://x.com/s_pratibhan"
        />
        </div>
      </body>
    </html>
  );
}
