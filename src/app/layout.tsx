// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Marketing Plan Tool — BeamX Solutions",
  description: "Marketing Plan Tool by BeamX Solutions — generate comprehensive marketing plans in minutes with Claude AI using our proven 9-square framework.",
  keywords: "marketing plan, AI marketing, business strategy, Claude AI, marketing automation, small business marketing",
  authors: [{ name: "BeamX Solutions" }],
  creator: "BeamX Solutions",
  publisher: "BeamX Solutions",
  openGraph: {
    title: "Marketing Plan Tool — BeamX Solutions",
    description: "Generate comprehensive marketing plans in minutes with Claude AI",
    url: "https://marketingplan.beamxsolutions.com",
    siteName: "BeamX Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Plan Tool — BeamX Solutions",
    description: "Generate comprehensive marketing plans in minutes with Claude AI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}