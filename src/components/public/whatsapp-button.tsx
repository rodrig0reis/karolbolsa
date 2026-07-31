import { getStoreSettings } from "@/lib/settings"
import { WhatsappFloatingClient } from "./whatsapp-floating-client"
import { Phone } from "lucide-react"

export async function WhatsappButton() {
  const settings = await getStoreSettings()
  
  if (!settings?.whatsappNumber || !settings.floatWhatsapp) return null

  // Ensure it only contains numbers
  const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "")
  const message = settings.whatsappGeneralMsg || "Olá, vim pelo site da Karol Bolsas e gostaria de atendimento."
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return <WhatsappFloatingClient url={url} />
}
