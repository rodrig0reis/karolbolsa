import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karolbolsas.manialivre.com.br"

  const fixedRoutes = [
    "",
    "/produtos",
    "/bolsas",
    "/promocoes",
    "/sobre",
    "/contato",
    "/termos",
    "/privacidade",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }))

  const categorias = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const categoryRoutes = categorias.map((cat) => ({
    url: `${siteUrl}/categoria/${cat.slug}`,
    lastModified: cat.updatedAt,
  }))

  const produtos = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const productRoutes = produtos.map((prod) => ({
    url: `${siteUrl}/produto/${prod.slug}`,
    lastModified: prod.updatedAt,
  }))

  return [...fixedRoutes, ...categoryRoutes, ...productRoutes]
}
