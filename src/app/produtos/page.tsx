import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

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
            <Card key={produto.id} className="group overflow-hidden border-border/50 bg-background hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
              <Link href={`/produto/${produto.slug}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {produto.isPromo && (
                    <Badge className="absolute top-3 left-3 z-10 bg-rose-500 hover:bg-rose-600 text-white shadow-sm border-none">
                      Promoção
                    </Badge>
                  )}
                  <Image
                    src={produto.mainImage}
                    alt={produto.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">{produto.category.name}</div>
                  <h3 className="font-medium text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {produto.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-3">
                    {produto.promoPrice && produto.isPromo ? (
                      <>
                        <span className="text-lg font-bold text-primary">R$ {produto.promoPrice.toString().replace('.', ',')}</span>
                        <span className="text-sm text-muted-foreground line-through">R$ {produto.price.toString().replace('.', ',')}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-foreground">R$ {produto.price.toString().replace('.', ',')}</span>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
