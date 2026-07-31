import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

export default async function NovoProdutoPage() {
  const categorias = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, parentId: true }
  })

  return <ProductForm categorias={categorias} />
}
