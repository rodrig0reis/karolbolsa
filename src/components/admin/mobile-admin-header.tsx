"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { adminLinks } from "./admin-sidebar"

interface MobileAdminHeaderProps {
  email: string
}

export function MobileAdminHeader({ email }: MobileAdminHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="h-16 border-b bg-card flex items-center justify-between px-4 md:hidden sticky top-0 z-50 shadow-sm">
      <Link href="/admin" className="flex items-center gap-2 font-serif font-bold text-lg text-primary">
        <Store className="h-5 w-5" />
        Karol Bolsas
      </Link>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetHeader className="p-6 border-b text-left">
            <SheetTitle className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
              <Store className="h-6 w-6" />
              Menu Admin
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {adminLinks.map((link) => {
              const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
              
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-foreground/80"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-card rounded-lg border shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
              </div>
            </div>
            <form method="post" action="/api/admin/logout" className="w-full">
              <Button type="submit" variant="destructive" className="w-full flex items-center gap-2 justify-center h-12">
                <LogOut className="h-5 w-5" />
                Sair do Painel
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
