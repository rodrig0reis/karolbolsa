import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/public/product-card"
import { buildProductWhatsAppUrl } from "@/lib/utils"
import Link from "next/link"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Bolsas | Karol Bolsas",
  description: "Confira nossa coleção completa de bolsas femininas."
}

export default async function BolsasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const subFilter = typeof resolvedParams.sub === "string" ? resolvedParams.sub : null

  // Buscar categoria principal e subcategorias
  const mainCat = await prisma.category.findUnique({ where: { slug: "bolsas" } })
  const subcategories = mainCat 
    ? await prisma.category.findMany({ where: { parentId: mainCat.id, isActive: true }, orderBy: { sortOrder: "asc" } }) 
    : []

  const validCategoryIds = mainCat ? [mainCat.id, ...subcategories.map(c => c.id)] : []

  let categoryFilter: any = { in: validCategoryIds }
  if (subFilter) {
    const sub = subcategories.find(c => c.slug === subFilter)
    if (sub) {
      categoryFilter = sub.id
    }
  }

  const [produtos, settings] = await Promise.all([
    prisma.product.findMany({
      where: { 
        isActive: true,
        categoryId: validCategoryIds.length > 0 ? categoryFilter : undefined
      },
      include: { category: true },
      orderBy: [
        { isAvailable: 'desc' },
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    }),
    prisma.storeSettings.findFirst()
  ])

  const whatsappNumber = settings?.whatsappNumber

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center mb-12 space-y-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-center">
          Bolsas
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Nossa coleção completa de bolsas femininas. Modelos transversais, de mão, de praia e artesanais para todos os momentos.
        </p>
      </div>

      {subcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-4 pb-8 md:flex-wrap md:justify-center scrollbar-hide">
          <Link href="/bolsas">
            <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${!subFilter ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted text-foreground'}`}>
              Todas
            </div>
          </Link>
          {subcategories.map(sub => (
            <Link key={sub.id} href={`/bolsas?sub=${sub.slug}`}>
              <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${subFilter === sub.slug ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted text-foreground'}`}>
                {sub.name}
              </div>
            </Link>
          ))}
        </div>
      )}

      {produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
          <p>Nenhuma bolsa disponível no momento.</p>
          <Link href="/produtos">
            <span className="text-primary hover:underline cursor-pointer">Ver todos os produtos</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[390px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {produtos.map((produto) => {
            let whatsappUrl = undefined
            if (whatsappNumber && produto.isAvailable) {
              const currentPrice = produto.isPromo && produto.promoPrice ? produto.promoPrice : produto.price
              whatsappUrl = buildProductWhatsAppUrl(whatsappNumber, produto.name, currentPrice)
            }

            return (
              <ProductCard 
                key={produto.id}
                id={produto.id}
                name={produto.name}
                slug={produto.slug}
                price={produto.price}
                promoPrice={produto.promoPrice}
                mainImage={produto.mainImage}
                isPromo={produto.isPromo}
                isAvailable={produto.isAvailable}
                isActive={produto.isActive}
                stock={produto.stock}
                categoryName={produto.category.name}
                whatsappUrl={whatsappUrl}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
