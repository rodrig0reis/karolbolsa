import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karol Bolsas | Elegância e Estilo",
  description: "Loja especializada em bolsas e acessórios femininos.",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo-karol-bolsas.jpg",
  },
  openGraph: {
    title: "Karol Bolsas | Elegância e Estilo",
    description: "Loja especializada em bolsas e acessórios femininos.",
    url: "https://karolbolsas.manialivre.com.br/",
    siteName: "Karol Bolsas",
    images: [
      {
        url: "https://karolbolsas.manialivre.com.br/og-karol-bolsas.jpg",
        width: 1200,
        height: 630,
        alt: "Karol Bolsas Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karol Bolsas | Elegância e Estilo",
    description: "Loja especializada em bolsas e acessórios femininos.",
    images: ["https://karolbolsas.manialivre.com.br/og-karol-bolsas.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        {children}
      </body>
    </html>
  );
}
