"use server"

import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/admin-session"
import bcrypt from "bcryptjs"
import { z } from "zod"

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirme a nova senha")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "A nova senha e a confirmação não coincidem",
  path: ["confirmPassword"]
})

export async function updateAdminPassword(prevState: any, formData: FormData) {
  const session = await getAdminSession()
  if (!session) {
    return { error: "Não autorizado" }
  }

  const result = updatePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { currentPassword, newPassword } = result.data

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    })

    if (!user) {
      return { error: "Usuário não encontrado" }
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return { error: "Senha atual incorreta" }
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    })

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar senha:", error)
    return { error: "Ocorreu um erro ao atualizar a senha. Tente novamente." }
  }
}
