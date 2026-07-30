import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

export default async function NovoProdutoPage() {
  const categorias = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })

  return <ProductForm categorias={categorias} />
}
