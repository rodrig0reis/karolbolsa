import { getAdminSession } from "@/lib/admin-session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getAdminSession()

  return Response.json({
    hasSession: !!session,
    session: session || null,
  })
}
