"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "../../auth"

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

export async function createCategory(prevState: unknown, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  const name = formData.get("name") as string
  let slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const isActive = formData.get("isActive") === "on"
  const orderStr = formData.get("order") as string
  const order = orderStr ? parseInt(orderStr, 10) : 0
  
  if (!name) return { error: "O nome da categoria é obrigatório." }
  if (order < 0) return { error: "A ordem não pode ser negativa." }

  if (!slug) {
    slug = generateSlug(name)
  } else {
    slug = generateSlug(slug)
  }

  try {
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return { error: "Já existe uma categoria com este nome/slug." }
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        description,
        isActive,
        order
      }
    })

    revalidatePath("/admin/categorias")
    revalidatePath("/")
    revalidatePath("/produtos")
    return { success: true, message: "Categoria criada com sucesso!" }
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return { error: "Ocorreu um erro ao criar a categoria." }
  }
}

export async function updateCategory(prevState: unknown, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  const id = formData.get("id") as string
  if (!id) return { error: "ID da categoria ausente." }

  const name = formData.get("name") as string
  let slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const isActive = formData.get("isActive") === "on"
  const orderStr = formData.get("order") as string
  const order = orderStr ? parseInt(orderStr, 10) : 0
  
  if (!name) return { error: "O nome da categoria é obrigatório." }
  if (order < 0) return { error: "A ordem não pode ser negativa." }

  if (!slug) {
    slug = generateSlug(name)
  } else {
    slug = generateSlug(slug)
  }

  try {
    const existingCategoria = await prisma.category.findUnique({ where: { id } })
    if (!existingCategoria) return { error: "Categoria não encontrada." }

    const existingSlug = await prisma.category.findUnique({ where: { slug } })
    if (existingSlug && existingSlug.id !== id) {
      return { error: "Já existe outra categoria com este slug." }
    }

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        isActive,
        order
      }
    })

    revalidatePath("/admin/categorias")
    revalidatePath("/")
    revalidatePath("/produtos")
    return { success: true, message: "Categoria atualizada com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error)
    return { error: "Erro interno ao atualizar a categoria." }
  }
}

export async function toggleCategoryActive(id: string) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  try {
    const categoria = await prisma.category.findUnique({ where: { id } })
    if (!categoria) return { error: "Categoria não encontrada." }

    await prisma.category.update({
      where: { id },
      data: { isActive: !categoria.isActive }
    })
    
    revalidatePath("/admin/categorias")
    revalidatePath("/")
    revalidatePath("/produtos")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao inativar/ativar categoria." }
  }
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  try {
    const count = await prisma.product.count({ where: { categoryId: id } })
    if (count > 0) {
      return { error: `Esta categoria possui ${count} produto(s) vinculados. Inative a categoria ou mova os produtos antes de excluir.` }
    }

    await prisma.category.delete({ where: { id } })
    revalidatePath("/admin/categorias")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao deletar categoria." }
  }
}
