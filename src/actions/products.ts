"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "../../../auth"
import { LocalStorageProvider } from "@/lib/storage/local-storage"

// Utilitário para gerar slug
function generateSlug(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

const storage = new LocalStorageProvider()

export async function createProduct(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  const name = formData.get("name") as string
  const shortDesc = formData.get("shortDesc") as string
  const fullDesc = formData.get("fullDesc") as string
  const categoryId = formData.get("categoryId") as string
  const priceStr = formData.get("price") as string
  const promoPriceStr = formData.get("promoPrice") as string
  const stockStr = formData.get("stock") as string
  const isFeatured = formData.get("isFeatured") === "on"
  const isPromo = formData.get("isPromo") === "on"

  const mainImageFile = formData.get("mainImage") as File | null
  const additionalImages = formData.getAll("additionalImages") as File[]

  if (!name || !categoryId || !priceStr || !mainImageFile || mainImageFile.size === 0) {
    return { error: "Nome, Categoria, Preço e Imagem Principal são obrigatórios." }
  }

  const slug = generateSlug(name)
  const price = parseFloat(priceStr.replace(",", "."))
  const promoPrice = promoPriceStr ? parseFloat(promoPriceStr.replace(",", ".")) : null
  const stock = stockStr ? parseInt(stockStr, 10) : 0

  try {
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return { error: "Já existe um produto com este nome/slug." }
    }

    // 1. Upload da imagem principal
    let mainImageUrl = ""
    if (mainImageFile && mainImageFile.size > 0) {
      mainImageUrl = await storage.uploadFile(mainImageFile, "products")
    }

    // 2. Criar produto no banco
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        shortDesc,
        fullDesc,
        price,
        promoPrice,
        stock,
        categoryId,
        isFeatured,
        isPromo,
        mainImage: mainImageUrl,
      }
    })

    // 3. Upload das imagens adicionais (se houver)
    const validAdditionalImages = additionalImages.filter(file => file.size > 0)
    if (validAdditionalImages.length > 0) {
      const uploadPromises = validAdditionalImages.map(file => storage.uploadFile(file, "products"))
      const uploadedUrls = await Promise.all(uploadPromises)

      const imagesData = uploadedUrls.map((url, index) => ({
        url,
        productId: product.id,
        order: index
      }))

      await prisma.productImage.createMany({
        data: imagesData
      })
    }

    revalidatePath("/admin/produtos")
    revalidatePath("/")
    return { success: true, message: "Produto criado com sucesso!" }
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return { error: "Ocorreu um erro ao criar o produto." }
  }
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  try {
    const product = await prisma.product.findUnique({ 
      where: { id },
      include: { images: true } 
    })
    
    if (!product) return { error: "Produto não encontrado." }

    // Deletar imagens do storage (opcional, mas recomendado)
    if (product.mainImage && product.mainImage.startsWith("/uploads")) {
      await storage.deleteFile(product.mainImage)
    }
    
    for (const img of product.images) {
      if (img.url.startsWith("/uploads")) {
        await storage.deleteFile(img.url)
      }
    }

    await prisma.product.delete({ where: { id } })
    
    revalidatePath("/admin/produtos")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return { error: "Erro ao deletar produto." }
  }
}
