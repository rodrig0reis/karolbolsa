import { CategoryForm } from "@/components/admin/category-form"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function NovaCategoriaPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  })
  return <CategoryForm parentCategories={categories} />
}
