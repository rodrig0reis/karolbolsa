import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/admin/category-form"
import { notFound } from "next/navigation"

export default async function EditarCategoriaPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const categoria = await prisma.category.findUnique({
    where: { id }
  })

  if (!categoria) {
    notFound()
  }

  return <CategoryForm initialData={categoria} />
}
