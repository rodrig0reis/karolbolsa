import { auth } from "../../../../auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, Tags, Settings, LogOut, Store } from "lucide-react"
import { signOutAction } from "@/actions/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    // Middleware should handle this, but just in case
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
            <Store className="h-6 w-6" />
            Karol Bolsas
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-foreground/80 hover:text-primary transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/admin/produtos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-foreground/80 hover:text-primary transition-colors">
            <Package className="h-5 w-5" />
            Produtos
          </Link>
          <Link href="/admin/categorias" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-foreground/80 hover:text-primary transition-colors">
            <Tags className="h-5 w-5" />
            Categorias
          </Link>
          <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-foreground/80 hover:text-primary transition-colors">
            <Settings className="h-5 w-5" />
            Configurações
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
            </div>
          </div>
          <form action={signOutAction}>
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors">
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="h-16 border-b bg-card flex items-center px-6 md:hidden">
          <span className="font-serif font-bold text-lg text-primary">Admin Karol Bolsas</span>
          {/* A hamburger menu would go here for mobile */}
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
