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
  const description = formData.get("description") as string
  
  if (!name) return { error: "O nome da categoria é obrigatório." }

  const slug = generateSlug(name)

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
      }
    })

    revalidatePath("/admin/categorias")
    return { success: true, message: "Categoria criada com sucesso!" }
  } catch (error) {
    console.error("Erro ao criar categoria:", error)
    return { error: "Ocorreu um erro ao criar a categoria." }
  }
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (!session) return { error: "Não autorizado" }

  try {
    // Verificar se tem produtos atrelados
    const count = await prisma.product.count({ where: { categoryId: id } })
    if (count > 0) {
      return { error: `Não é possível deletar. Esta categoria possui ${count} produto(s).` }
    }

    await prisma.category.delete({ where: { id } })
    revalidatePath("/admin/categorias")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao deletar categoria." }
  }
}
