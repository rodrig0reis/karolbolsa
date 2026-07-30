import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Phone } from "lucide-react"
import { buildGeneralWhatsAppUrl } from "@/lib/utils"

export async function WhatsappButton() {
  const settings = await prisma.storeSettings.findFirst()
  
  if (!settings?.whatsappNumber) return null

  // Ensure it only contains numbers
  const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "")
  const url = buildGeneralWhatsAppUrl(whatsappNumber)

  return (
    <Link 
      href={url}
      target="_blank"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-110 hover:bg-emerald-600 transition-all duration-300"
      title="Fale conosco no WhatsApp"
    >
      <Phone className="h-6 w-6" />
    </Link>
  )
}
