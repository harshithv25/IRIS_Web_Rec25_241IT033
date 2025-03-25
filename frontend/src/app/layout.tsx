import type { Metadata } from "next";
import "./globals.css";
import { Orbitron } from "next/font/google";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sportshub",
  description: "Dashboard for all your sports needs - NITK",
  icons: {
    icon: "/favicon.ico",
    // apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Sportshub NITK",
    description: "Dashboard for all your sports needs - NITK",
    url: "https://sportshub-nitk.com",
    siteName: "Sportshub NITK",
    images: [
      {
        url: "/path-to-your-logo.png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sportshub NITK",
    description: "Dashboard for all your sports needs - NITK",
    images: ["/path-to-your-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
