import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

// Busca do banco sem cache para uso no painel admin (mutate)
export async function getStoreSettingsUncached() {
  const settings = await prisma.storeSettings.findFirst()
  return settings
}

// Busca com cache infinito para o site público
// Ao atualizar configurações no admin, usamos revalidateTag("store-settings")
export const getStoreSettings = unstable_cache(
  async () => {
    try {
      let settings = await prisma.storeSettings.findFirst()
      
      // Fallback: se não existir, cria o registro inicial
      if (!settings) {
        settings = await prisma.storeSettings.create({
          data: {
            storeName: "Karol Bolsas",
            slogan: "Bolsas femininas e moda praia.",
            seoTitle: "Karol Bolsas | Moda Feminina em Pirangi",
            seoDescription: "As melhores bolsas artesanais e moda praia de Pirangi do Norte/RN.",
          }
        })
      }
      
      return settings
    } catch (e) {
      console.warn("[SETTINGS] Failed to fetch settings from DB, using fallback", e)
      return {
        storeName: "Karol Bolsas",
        slogan: "Bolsas femininas e moda praia.",
        seoTitle: "Karol Bolsas | Moda Feminina em Pirangi",
        seoDescription: "As melhores bolsas artesanais e moda praia de Pirangi do Norte/RN.",
        whatsappNumber: null,
        instagramLink: "https://www.instagram.com/karolbolsas_artesanais/",
        allowIndexing: true,
        floatWhatsapp: true,
      } as any // fallback typing
    }
  },
  ["store-settings-cache"],
  {
    tags: ["store-settings"],
    revalidate: false, // Só invalida quando o admin forçar
  }
)
