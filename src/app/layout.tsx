import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

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
  verification: {
    google: "kFb03BGpnkiobIHExgY-r2GxlpxzNMxdpc-D8W8i33Y",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4993659712368690" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4993659712368690" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4H1HX6SQZF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4H1HX6SQZF');
        `}</Script>
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
