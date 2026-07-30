import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"
import { notFound } from "next/navigation"

export default async function EditarProdutoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const produto = await prisma.product.findUnique({
    where: { id }
  })

  if (!produto) {
    notFound()
  }

  const categorias = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })

  // To allow parsing decimal correctly, serialize before passing to client components.
  // Next.js handles Decimal fine in Server components, but we can map it to string/number if needed.
  // We'll pass it as is and let the client form deal with it or serialize it:
  const serializedProduct = {
    ...produto,
    price: produto.price.toString(),
    promoPrice: produto.promoPrice?.toString() || null,
  }

  return <ProductForm categorias={categorias} initialData={serializedProduct} />
}
