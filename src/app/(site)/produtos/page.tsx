import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { ProductCard } from "@/components/public/product-card"
import { ProductsFilter } from "./products-filter"
import { buildProductWhatsAppUrl } from "@/lib/utils"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TodosProdutosPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined
  const categoriaSlug = typeof resolvedParams.categoria === 'string' ? resolvedParams.categoria : undefined
  const promocao = resolvedParams.promocao === 'true'
  const disponibilidade = typeof resolvedParams.disponibilidade === 'string' ? resolvedParams.disponibilidade : undefined
  const ordem = typeof resolvedParams.ordem === 'string' ? resolvedParams.ordem : 'mais-recentes'

  const where: Prisma.ProductWhereInput = { isActive: true }

  if (q) {
    where.name = { contains: q, mode: 'insensitive' }
  }

  if (categoriaSlug) {
    where.category = { slug: categoriaSlug, isActive: true }
  } else {
    // Mesmo sem filtro específico, garantir que a categoria esteja ativa
    where.category = { isActive: true }
  }

  if (promocao) {
    where.isPromo = true
  }

  if (disponibilidade === 'disponivel') {
    where.isAvailable = true
  } else if (disponibilidade === 'esgotado') {
    where.isAvailable = false
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = { createdAt: 'desc' }
  
  switch (ordem) {
    case 'menor-preco':
      orderBy = { price: 'asc' }
      break
    case 'maior-preco':
      orderBy = { price: 'desc' }
      break
    case 'destaques':
      orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      break
    case 'promocoes':
      orderBy = [{ isPromo: 'desc' }, { createdAt: 'desc' }]
      break
  }

  const [produtos, categorias, settings] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { order: 'asc' }
    }),
    prisma.storeSettings.findFirst()
  ])

  const whatsappNumber = settings?.whatsappNumber

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center mb-8 space-y-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-center">Todos os Produtos</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Confira nossa coleção completa de bolsas e acessórios femininos. Encontre o modelo perfeito para o seu estilo.
        </p>
      </div>

      <ProductsFilter categorias={categorias} />

      {produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nenhum produto encontrado com os filtros selecionados.
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
