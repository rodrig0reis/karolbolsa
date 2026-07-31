import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/public/product-card"
import { buildProductWhatsAppUrl } from "@/lib/utils"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearch = await searchParams
  const subFilter = typeof resolvedSearch.sub === "string" ? resolvedSearch.sub : null
  
  const [category, settings] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: resolvedParams.slug, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" }
        }
      }
    }),
    prisma.storeSettings.findFirst()
  ])

  if (!category) {
    notFound()
  }

  const subcategories = category.children || []
  const validCategoryIds = [category.id, ...subcategories.map(c => c.id)]

  let categoryFilter: any = { in: validCategoryIds }
  if (subFilter) {
    const sub = subcategories.find(c => c.slug === subFilter)
    if (sub) {
      categoryFilter = sub.id
    }
  }

  const produtos = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: categoryFilter
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })
  const whatsappNumber = settings?.whatsappNumber

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center mb-12 space-y-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-center">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground text-center max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      {subcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-4 pb-8 md:flex-wrap md:justify-center scrollbar-hide">
          <Link href={`/categoria/${category.slug}`}>
            <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${!subFilter ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted text-foreground'}`}>
              Todos
            </div>
          </Link>
          {subcategories.map(sub => (
            <Link key={sub.id} href={`/categoria/${category.slug}?sub=${sub.slug}`}>
              <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${subFilter === sub.slug ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted text-foreground'}`}>
                {sub.name}
              </div>
            </Link>
          ))}
        </div>
      )}

      {produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
          <p>Não há produtos nesta categoria no momento.</p>
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
                categoryName={category.name}
                whatsappUrl={whatsappUrl}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
