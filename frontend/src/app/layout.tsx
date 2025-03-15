import { AuthProvider } from "../../context/AuthContext";
import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sports Booking",
  description: "NITK Sports Infrastructure Booking System",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
