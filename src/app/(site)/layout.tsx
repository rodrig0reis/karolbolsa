import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { WhatsappButton } from "@/components/public/whatsapp-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsappButton />
    </div>
  );
}
