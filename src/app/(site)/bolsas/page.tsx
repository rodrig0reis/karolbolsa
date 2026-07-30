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

export default async function BolsasPage() {
  const [produtos, settings] = await Promise.all([
    prisma.product.findMany({
      where: { 
        isActive: true,
        category: {
          slug: {
            in: ["bolsas", "bolsas-de-mao", "bolsas-transversais", "bolsas-artesanais", "bolsas-de-praia"]
          }
        }
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

      {produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
          <p>Nenhuma bolsa disponível no momento.</p>
          <Link href="/produtos">
            <span className="text-primary hover:underline cursor-pointer">Ver todos os produtos</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
