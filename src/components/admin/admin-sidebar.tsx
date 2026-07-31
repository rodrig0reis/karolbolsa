"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tags, Settings, LogOut, Store, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/produtos", icon: Package, label: "Produtos" },
  { href: "/admin/categorias", icon: Tags, label: "Categorias" },
  { href: "/admin/banners", icon: ImageIcon, label: "Banners" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
]

interface AdminSidebarProps {
  email: string
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-card border-r flex-col hidden md:flex h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
          <Store className="h-6 w-6" />
          Karol Bolsas
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {adminLinks.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted text-foreground/80 hover:text-primary"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>
        <form method="post" action="/api/admin/logout">
          <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors text-sm font-medium">
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
