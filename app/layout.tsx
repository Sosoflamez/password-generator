import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassGankpo — Générateur de mots de passe",
  description: "Générez des mots de passe sécurisés en un clic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
