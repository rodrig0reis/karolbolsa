import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/public/product-card"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Promoções | Karol Bolsas",
  description: "Bolsas e acessórios com condições especiais na Karol Bolsas."
}

export default async function PromocoesPage() {
  const [produtos, settings] = await Promise.all([
    prisma.product.findMany({
      where: { 
        isActive: true,
        isPromo: true 
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.storeSettings.findFirst()
  ])

  const whatsappNumber = settings?.whatsappNumber
  const baseWhatsappMsg = settings?.whatsappMsg || "Olá, gostaria de saber mais sobre [NOME DO PRODUTO] no valor de R$ [VALOR]."

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center mb-12 space-y-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-center text-rose-600">
          Promoções Especiais
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Confira bolsas e acessórios com condições especiais. As promoções podem ter disponibilidade limitada e os valores podem ser confirmados diretamente com nosso atendimento pelo WhatsApp.
        </p>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nenhuma promoção disponível no momento. Acompanhe nossas novidades pelo Instagram.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => {
            let whatsappUrl = undefined
            if (whatsappNumber && produto.isAvailable) {
              const currentPrice = produto.isPromo && produto.promoPrice ? produto.promoPrice : produto.price
              const msg = baseWhatsappMsg
                .replace("[NOME DO PRODUTO]", produto.name)
                .replace("[VALOR]", currentPrice.toString().replace(".", ","))
              whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`
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
