import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/public/product-card"
import { buildProductWhatsAppUrl } from "@/lib/utils"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  const [category, settings] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: resolvedParams.slug, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    prisma.storeSettings.findFirst()
  ])

  if (!category) {
    notFound()
  }

  const produtos = category.products
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

      {produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
          <p>Não há produtos nesta categoria no momento.</p>
          <Link href="/produtos">
            <span className="text-primary hover:underline cursor-pointer">Ver todos os produtos</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
