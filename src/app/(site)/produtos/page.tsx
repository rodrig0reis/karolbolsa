import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/public/product-card"

export default async function TodosProdutosPage() {
  const produtos = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col items-center mb-12 space-y-4">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-center">Todos os Produtos</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Confira nossa coleção completa de bolsas e acessórios femininos. Encontre o modelo perfeito para o seu estilo.
        </p>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Nenhum produto cadastrado no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
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
              categoryName={produto.category.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}
