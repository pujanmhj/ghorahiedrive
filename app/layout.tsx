import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/ui";

export const metadata: Metadata = {
  title: "Dang E Drive P.V.T. Limited - Reliable Taxi Service Across Nepal",
  description: "Dang E Drive P.V.T. Limited offers premium, reliable, and comfortable taxi and rental services connecting Dang with Kathmandu, Pokhara, Butwal, Nepalgunj, Chitwan, and other destinations across Nepal.",
  keywords: "dang taxi service, nepal travel, dang e drive, kathmandu taxi, pokhara travel booking, rental cars nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-[#F8FAF8] text-[#1A1A1A] font-sans selection:bg-[#4CAF50] selection:text-white"
        suppressHydrationWarning
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
