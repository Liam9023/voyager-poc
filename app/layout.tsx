import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TripProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Voyager — your travel expert",
  description:
    "Voyager builds a complete, locally-informed trip itinerary and travels with you as a companion throughout. A proof-of-concept demo.",
};

export const viewport: Viewport = {
  themeColor: "#2C4858",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg">
        <TripProvider>
          {/* Centred app column — mobile-first, holds cleanly at desktop widths */}
          <div className="relative mx-auto flex min-h-screen w-full max-w-app flex-col bg-bg shadow-[0_0_60px_rgba(44,72,88,0.08)] md:border-x md:border-border">
            {children}
          </div>
        </TripProvider>
      </body>
    </html>
  );
}
