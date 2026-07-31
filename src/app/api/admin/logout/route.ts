import { clearAdminSession } from "@/lib/admin-session"
import { redirect } from "next/navigation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  await clearAdminSession()
  redirect("/admin/login")
}

export async function GET() {
  await clearAdminSession()
  redirect("/admin/login")
}
