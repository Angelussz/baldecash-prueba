import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "BaldeCash - Solicitud de Financiamiento",
  description: "Plataforma de solicitud de préstamos personales BaldeCash",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
