"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "../../../auth"

export async function updateSettings(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  const id = formData.get("id") as string
  const storeName = formData.get("storeName") as string
  const whatsappNumber = formData.get("whatsappNumber") as string
  const whatsappMsg = formData.get("whatsappMsg") as string
  const instagramLink = formData.get("instagramLink") as string
  const footerText = formData.get("footerText") as string
  const workingHours = formData.get("workingHours") as string
  const email = formData.get("email") as string

  if (!storeName) return { error: "O nome da loja é obrigatório." }

  try {
    if (id) {
      await prisma.storeSettings.update({
        where: { id },
        data: {
          storeName,
          whatsappNumber,
          whatsappMsg,
          instagramLink,
          footerText,
          workingHours,
          email,
        }
      })
    } else {
      // Fallback in case settings was somehow deleted
      await prisma.storeSettings.create({
        data: {
          storeName,
          whatsappNumber,
          whatsappMsg,
          instagramLink,
          footerText,
          workingHours,
          email,
        }
      })
    }

    // Revalidar tudo pois o header e footer aparecem em todas as páginas
    revalidatePath("/", "layout")
    return { success: true, message: "Configurações salvas com sucesso!" }
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return { error: "Ocorreu um erro ao salvar as configurações." }
  }
}
