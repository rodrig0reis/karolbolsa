import { prisma } from "@/lib/prisma"
import { ProductListClient } from "./product-list-client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProdutosPage() {
  const produtos = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    }
  })

  const categorias = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Produtos</h1>
        <p className="text-muted-foreground mt-1">Gerencie o catálogo de bolsas e acessórios.</p>
      </div>

      <ProductListClient 
        initialProducts={produtos} 
        categories={categorias} 
      />
    </div>
  )
}
