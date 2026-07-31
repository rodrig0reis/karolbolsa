import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const session = await getAdminSession()

    if (!session || String(session.role).toUpperCase() !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const data: Record<string, any> = {}

    // Converter formData em objeto, omitindo propriedades vazias do prototype
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    // Converter booleanos
    const floatWhatsapp = data.floatWhatsapp === "true"
    const allowIndexing = data.allowIndexing === "true"

    let settings = await prisma.storeSettings.findFirst()

    if (settings) {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          storeName: data.storeName,
          slogan: data.slogan,
          shortDesc: data.shortDesc,
          aboutText: data.aboutText,
          email: data.email,
          phone: data.phone,
          whatsappNumber: data.whatsappNumber,
          city: data.city,
          state: data.state,
          workingHours: data.workingHours,
          instagramLink: data.instagramLink,
          facebookLink: data.facebookLink,
          tiktokLink: data.tiktokLink,
          pinterestLink: data.pinterestLink,
          linktreeLink: data.linktreeLink,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          logoUrl: data.logoUrl,
          footerLogoUrl: data.footerLogoUrl,
          faviconUrl: data.faviconUrl,
          ogImageUrl: data.ogImageUrl,
          floatWhatsapp: floatWhatsapp,
          whatsappMsg: data.whatsappMsg,
          whatsappGeneralMsg: data.whatsappGeneralMsg,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          seoKeywords: data.seoKeywords,
          allowIndexing: allowIndexing,
          footerText: data.footerText,
        },
      })
    } else {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: data.storeName || "Karol Bolsas",
          floatWhatsapp,
          allowIndexing,
        },
      })
    }

    // Limpar cache de configurações globais
    revalidatePath("/", "layout")

    return NextResponse.json(settings)
  } catch (error) {
    console.error("[SETTINGS_SAVE]", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
