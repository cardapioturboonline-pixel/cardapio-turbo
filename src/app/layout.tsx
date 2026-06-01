import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cardápio Turbo — Cardápio Digital para Lanchonetes",
  description: "Crie um cardápio digital profissional em menos de 5 minutos e aumente seus pedidos pelo WhatsApp.",
  keywords: "cardápio digital, cardápio online, lanchonete, hamburgueria, pizzaria, QR code, pedido whatsapp",
  openGraph: {
    title: "Cardápio Turbo",
    description: "Cardápio digital para pequenos negócios",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
