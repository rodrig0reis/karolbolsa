import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

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

export default async function ContatoPage() {
  const settings = await prisma.storeSettings.findFirst()
  const instagramUrl = settings?.instagramLink || "https://www.instagram.com/karolbolsas_artesanais/"

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-primary">
            Entre em Contato
          </h1>
          
          <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
            <p>
              Fale com a Karol Bolsas pelo WhatsApp para tirar dúvidas, consultar disponibilidade, formas de pagamento e combinar a melhor forma de entrega.
            </p>
            <p>
              Também acompanhe nossas novidades, lançamentos e promoções pelo Instagram oficial da loja.
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            {settings?.whatsappNumber && (
              <Link href={`https://wa.me/${settings.whatsappNumber}`} target="_blank">
                <Button size="lg" className="w-full sm:w-auto text-base rounded-full shadow-md bg-emerald-600 hover:bg-emerald-700">
                  <Phone className="mr-2 h-5 w-5" />
                  Falar no WhatsApp
                </Button>
              </Link>
            )}

            <Link href={instagramUrl} target="_blank">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base rounded-full hover:text-primary border-primary/20">
                <InstagramIcon className="mr-2 h-5 w-5" />
                Seguir no Instagram
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-secondary/30 p-8 rounded-2xl flex flex-col justify-center space-y-6">
          <h3 className="font-serif text-2xl font-semibold mb-4">Outros Canais</h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="bg-background p-3 rounded-full text-primary shadow-sm">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Telefone / WhatsApp</p>
                <p className="text-muted-foreground">{settings?.whatsappNumber ? `+${settings.whatsappNumber}` : "Não informado"}</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-background p-3 rounded-full text-primary shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">E-mail</p>
                <p className="text-muted-foreground">{settings?.email || "contato@karolbolsas.com.br"}</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="bg-background p-3 rounded-full text-primary shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Atendimento</p>
                <p className="text-muted-foreground whitespace-pre-line">
                  {settings?.workingHours || "De Segunda a Sexta\ndas 09h às 18h"}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
