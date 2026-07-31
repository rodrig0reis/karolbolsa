import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Image as ImageIcon, CheckCircle2, XCircle } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/admin/status-badge"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: "asc" }
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Banners do Site</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os banners exibidos na página inicial e outras vitrines.
          </p>
        </div>
        <Link href="/admin/banners/novo" className={cn(buttonVariants({ variant: "default" }))}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Banner
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-muted/20 border rounded-xl border-dashed">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">Nenhum banner cadastrado</h3>
            <p className="text-muted-foreground mb-4">Adicione o seu primeiro banner para destacar promoções ou produtos.</p>
            <Link href="/admin/banners/novo" className={cn(buttonVariants({ variant: "outline" }))}>Criar Banner</Link>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[21/9] w-full bg-muted relative">
                {banner.imageUrl ? (
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Sem imagem
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <StatusBadge 
                    status={banner.isActive ? "active" : "inactive"} 
                  />
                  <div className="bg-background/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-semibold border">
                    Ordem: {banner.sortOrder}
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{banner.subtitle}</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 flex gap-2">
                  <Link href={`/admin/banners/${banner.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>Editar</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
