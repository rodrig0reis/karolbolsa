"use server"

import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-session"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const userSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["admin", "colaborador"] as const, {
    message: "O perfil deve ser 'admin' ou 'colaborador'."
  }),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
})

export async function getUsers() {
  const session = await getAdminSession()
  if (!session || session.role !== "ADMIN") return { error: "Não autorizado" }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    })
    return { success: true, users }
  } catch (error) {
    return { error: "Erro ao buscar usuários" }
  }
}

export async function createUser(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session || session.role !== "ADMIN") return { error: "Não autorizado" }

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as "admin" | "colaborador",
    password: formData.get("password") as string,
  }

  const result = userSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  if (!data.password) {
    return { error: "A senha é obrigatória para novos usuários" }
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return { error: "E-mail já está em uso" }

    const passwordHash = await bcrypt.hash(data.password, 10)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash,
      }
    })

    revalidatePath("/admin/configuracoes")
    return { success: true, message: "Usuário criado com sucesso!" }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { error: "Ocorreu um erro ao criar o usuário." }
  }
}

export async function deleteUser(id: string) {
  const session = await getAdminSession()
  if (!session || session.role !== "ADMIN") return { error: "Não autorizado" }

  if (session.userId === id) {
    return { error: "Você não pode excluir sua própria conta." }
  }

  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath("/admin/configuracoes")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir:", error)
    return { error: "Erro ao excluir o usuário." }
  }
}
