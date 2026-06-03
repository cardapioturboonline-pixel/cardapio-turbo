import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cardápio Turbo — Cardápio Digital para Lanchonetes",
  description: "Crie um cardápio digital profissional em menos de 5 minutos e aumente seus pedidos pelo WhatsApp.",
  keywords: "cardápio digital, cardápio online, lanchonete, hamburgueria, pizzaria, QR code, pedido whatsapp",
  metadataBase: new URL("https://cardapioturbo.com.br"),
  openGraph: {
    title: "Cardápio Turbo — Cardápio Digital para Lanchonetes",
    description: "Crie um cardápio digital profissional em menos de 5 minutos e aumente seus pedidos pelo WhatsApp.",
    type: "website",
    url: "https://cardapioturbo.com.br",
    siteName: "Cardápio Turbo",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardápio Turbo",
    description: "Cardápio digital para pequenos negócios",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
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
