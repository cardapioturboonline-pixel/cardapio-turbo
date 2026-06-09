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
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1271529755057665');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1271529755057665&ev=PageView&noscript=1" alt="" />
        </noscript>
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
