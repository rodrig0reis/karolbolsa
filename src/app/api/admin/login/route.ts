import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createAdminSession } from "@/lib/admin-session"
import { redirect } from "next/navigation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "").trim()

  if (!email || !password) {
    redirect("/admin/login?error=1")
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || !user.isActive || String(user.role).toUpperCase() !== "ADMIN") {
    redirect("/admin/login?error=1")
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    redirect("/admin/login?error=1")
  }

  await createAdminSession(user)
  
  redirect("/admin")
}
