import { prisma } from "@/lib/prisma"
import NovoProdutoPage from "./form"

export default async function Page() {
  const categorias = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })

  return <NovoProdutoPage categorias={categorias} />
}
