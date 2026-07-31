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

import { getStoreSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karolbolsas.manialivre.com.br";
  
  return {
    metadataBase: new URL(siteUrl),
    title: settings?.seoTitle || settings?.storeName || "Karol Bolsas | Elegância e Estilo",
    description: settings?.seoDescription || settings?.shortDesc || "Loja especializada em bolsas e acessórios femininos.",
    keywords: settings?.seoKeywords ? settings.seoKeywords.split(",").map((k: string) => k.trim()) : undefined,
    robots: {
      index: settings?.allowIndexing ?? true,
      follow: settings?.allowIndexing ?? true,
    },
    icons: {
      icon: settings?.faviconUrl || "/favicon.ico",
      apple: settings?.logoUrl || "/logo-karol-bolsas.jpg",
    },
    openGraph: {
      title: settings?.seoTitle || settings?.storeName || "Karol Bolsas",
      description: settings?.seoDescription || settings?.shortDesc || "",
      url: siteUrl,
      siteName: settings?.storeName || "Karol Bolsas",
      images: [
        {
          url: settings?.ogImageUrl || "/og-karol-bolsas.jpg",
          width: 1200,
          height: 630,
          alt: settings?.storeName || "Logo",
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.seoTitle || settings?.storeName || "Karol Bolsas",
      description: settings?.seoDescription || settings?.shortDesc || "",
      images: [settings?.ogImageUrl || "/og-karol-bolsas.jpg"],
    },
  };
}

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
