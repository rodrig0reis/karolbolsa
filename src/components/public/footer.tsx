import Link from "next/link"
import { formatPhoneBR } from "@/lib/utils"
import { MapPin, Phone, Mail } from "lucide-react"
import { getStoreSettings } from "@/lib/settings"

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

export async function Footer() {
  const settings = await getStoreSettings()
  const storeName = settings?.storeName || "Karol Bolsas"
  const instagramUrl = settings?.instagramLink || "https://www.instagram.com/karolbolsas_artesanais/"
  
  return (
    <footer className="bg-secondary/30 border-t mt-12">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-primary">{storeName}</h3>
            <p className="text-sm text-muted-foreground">
              {settings?.footerText || "Sua loja especializada em bolsas e acessórios femininos com elegância, qualidade e estilo."}
            </p>
            {instagramUrl && (
              <div className="flex items-center pt-2">
                <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Siga nosso Instagram">
                  <InstagramIcon className="h-5 w-5" />
                  <span className="font-medium text-sm">Siga no Instagram</span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Navegação</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link href="/produtos" className="hover:text-primary transition-colors">Produtos</Link></li>
              <li><Link href="/promocoes" className="hover:text-primary transition-colors">Promoções</Link></li>
              <li><Link href="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Atendimento</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contato" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>{settings?.whatsappNumber ? `WhatsApp: ${formatPhoneBR(settings.whatsappNumber)}` : "Não informado"}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>{settings?.email || "contato@karolbolsas.com.br"}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>{settings?.workingHours || "Atendimento de Seg a Sex,\ndas 09h às 18h"}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {storeName}. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/termos" className="hover:text-primary">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-primary">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
