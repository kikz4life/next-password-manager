import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {Toaster} from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESC = "Password Manager built built on NextJS. Author: Dean Francis Casili";
const TITLE = 'Your Password Manager Built for Security';
const BASE_URL = 'https://next-password-manager.vercel.app/';
const PREVIEW_IMG = `${BASE_URL}/preview.png`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: TITLE,
    description: DESC,
    url: BASE_URL,
    siteName: TITLE,
    images: [
      {
        url: PREVIEW_IMG,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: [PREVIEW_IMG],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <div className="fixed inset-0 -z-1">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
            <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>
          <main className="flex-grow min-h-[calc(100vh-122px)]">
            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
