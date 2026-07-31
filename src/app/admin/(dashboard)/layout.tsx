import { getAdminSession } from "@/lib/admin-session"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MobileAdminHeader } from "@/components/admin/mobile-admin-header"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  if (!session || String(session.role).toUpperCase() !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar email={session.email} />

      <main className="flex-1 flex flex-col min-w-0">
        <MobileAdminHeader email={session.email} />
        
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
