"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "../../auth"
import { LocalStorageProvider } from "@/lib/storage/local-storage"
import { z } from "zod"

const storage = new LocalStorageProvider()

const productSchema = z.object({
  name: z.string().min(1, "O nome do produto é obrigatório."),
  categoryId: z.string().min(1, "A categoria é obrigatória."),
  price: z.coerce.number().min(0.01, "O preço deve ser maior que zero."),
  promoPrice: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().min(0, "O estoque não pode ser negativo."),
  sku: z.string().optional(),
  brand: z.string().optional(),
  shortDesc: z.string().min(1, "A descrição curta é obrigatória."),
  fullDesc: z.string().optional(),
  material: z.string().optional(),
  colors: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  width: z.string().optional(),
  depth: z.string().optional(),
  isActive: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isPromo: z.boolean().default(false)
}).refine(data => {
  if (data.promoPrice && data.promoPrice >= data.price) {
    return false
  }
  return true
}, {
  message: "O preço promocional deve ser menor que o preço normal.",
  path: ["promoPrice"]
})

function generateSlug(text: string) {
  return text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-")
}

export async function createProduct(prevState: unknown, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  const mainImage = formData.get("mainImage") as File | null
  if (!mainImage || mainImage.size === 0) {
    return { error: "A imagem principal é obrigatória na criação." }
  }

  const rawData = {
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    promoPrice: formData.get("promoPrice") || null,
    stock: formData.get("stock"),
    sku: formData.get("sku"),
    brand: formData.get("brand"),
    shortDesc: formData.get("shortDesc"),
    fullDesc: formData.get("fullDesc"),
    material: formData.get("material"),
    colors: formData.get("colors"),
    weight: formData.get("weight"),
    height: formData.get("height"),
    width: formData.get("width"),
    depth: formData.get("depth"),
    isActive: formData.get("isActive") === "on",
    isAvailable: formData.get("isAvailable") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isPromo: formData.get("isPromo") === "on",
  }

  const parsed = productSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data
  let slug = generateSlug(data.name)

  try {
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const mainImageUrl = await storage.uploadProductImage(mainImage)

    const additionalImages = formData.getAll("additionalImages") as File[]
    const validAdditionalImages = additionalImages.filter(file => file.size > 0).slice(0, 6)
    
    let additionalUrls: string[] = []
    if (validAdditionalImages.length > 0) {
      additionalUrls = await Promise.all(validAdditionalImages.map(f => storage.uploadProductImage(f)))
    }

    const colorArray = data.colors ? data.colors.split(",").map(c => c.trim()).filter(c => c) : []

    const produto = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        categoryId: data.categoryId,
        price: data.price,
        promoPrice: data.promoPrice,
        stock: data.stock,
        sku: data.sku,
        brand: data.brand,
        shortDesc: data.shortDesc,
        fullDesc: data.fullDesc,
        material: data.material,
        colors: colorArray,
        weight: data.weight,
        height: data.height,
        width: data.width,
        depth: data.depth,
        isActive: data.isActive,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        isPromo: data.isPromo,
        mainImage: mainImageUrl
      }
    })

    if (additionalUrls.length > 0) {
      await prisma.productImage.createMany({
        data: additionalUrls.map((url, idx) => ({
          productId: produto.id,
          url,
          order: idx
        }))
      })
    }

    revalidatePath("/admin/produtos")
    revalidatePath("/")
    revalidatePath("/produtos")
    return { success: true, message: "Produto criado com sucesso!" }
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return { error: "Erro interno ao criar o produto." }
  }
}

export async function updateProduct(prevState: unknown, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  const id = formData.get("id") as string
  if (!id) return { error: "ID do produto ausente." }

  const rawData = {
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    promoPrice: formData.get("promoPrice") || null,
    stock: formData.get("stock"),
    sku: formData.get("sku"),
    brand: formData.get("brand"),
    shortDesc: formData.get("shortDesc"),
    fullDesc: formData.get("fullDesc"),
    material: formData.get("material"),
    colors: formData.get("colors"),
    weight: formData.get("weight"),
    height: formData.get("height"),
    width: formData.get("width"),
    depth: formData.get("depth"),
    isActive: formData.get("isActive") === "on",
    isAvailable: formData.get("isAvailable") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isPromo: formData.get("isPromo") === "on",
  }

  const parsed = productSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data
  const colorArray = data.colors ? data.colors.split(",").map(c => c.trim()).filter(c => c) : []

  try {
    const existingProduto = await prisma.product.findUnique({ where: { id } })
    if (!existingProduto) return { error: "Produto não encontrado." }

    let mainImageUrl = existingProduto.mainImage
    const mainImage = formData.get("mainImage") as File | null
    if (mainImage && mainImage.size > 0) {
      mainImageUrl = await storage.uploadProductImage(mainImage)
      if (existingProduto.mainImage) {
        await storage.deleteProductImage(existingProduto.mainImage)
      }
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        categoryId: data.categoryId,
        price: data.price,
        promoPrice: data.promoPrice,
        stock: data.stock,
        sku: data.sku,
        brand: data.brand,
        shortDesc: data.shortDesc,
        fullDesc: data.fullDesc,
        material: data.material,
        colors: colorArray,
        weight: data.weight,
        height: data.height,
        width: data.width,
        depth: data.depth,
        isActive: data.isActive,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        isPromo: data.isPromo,
        mainImage: mainImageUrl
      }
    })

    const additionalImages = formData.getAll("additionalImages") as File[]
    const validAdditionalImages = additionalImages.filter(file => file.size > 0).slice(0, 6)
    
    if (validAdditionalImages.length > 0) {
      const additionalUrls = await Promise.all(validAdditionalImages.map(f => storage.uploadProductImage(f)))
      await prisma.productImage.createMany({
        data: additionalUrls.map((url, idx) => ({
          productId: id,
          url,
          order: idx
        }))
      })
    }

    revalidatePath("/admin/produtos")
    revalidatePath("/")
    revalidatePath(`/produto/${existingProduto.slug}`)
    return { success: true, message: "Produto atualizado com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return { error: "Erro interno ao atualizar o produto." }
  }
}

export async function toggleProductActive(id: string) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  try {
    const produto = await prisma.product.findUnique({ where: { id } })
    if (!produto) return { error: "Produto não encontrado." }

    await prisma.product.update({
      where: { id },
      data: { isActive: !produto.isActive }
    })
    
    revalidatePath("/admin/produtos")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao inativar/ativar produto." }
  }
}

export async function deleteProductPermanent(id: string) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true }
    })

    if (product) {
      if (product.mainImage) {
        await storage.deleteProductImage(product.mainImage)
      }
      for (const img of product.images) {
        await storage.deleteProductImage(img.url)
      }
    }

    await prisma.product.delete({ where: { id } })
    
    revalidatePath("/admin/produtos")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar:", error)
    return { error: "Erro ao deletar produto." }
  }
}
