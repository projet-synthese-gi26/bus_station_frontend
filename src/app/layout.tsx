import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import LanguageProvider from "@/context/LanguageProvider";
import { BusStationProvider } from "@/context/Provider";

export const metadata: Metadata = {
  title: {
    default: "Bus Station - Réservez vos voyages simplement",
    template: "%s | Bus Station",
  },
  description:
    "La plateforme qui connecte les agences de voyages et les voyageurs pour une expérience de réservation fluide et sécurisée au Cameroun.",
  keywords: [
    "agence de voyage",
    "réservation bus",
    "cameroun",
    "voyage",
    "ticket bus",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <LanguageProvider>
          <BusStationProvider>{children}</BusStationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
