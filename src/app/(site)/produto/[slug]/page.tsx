import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductGallery } from "./gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } }
    }
  })

  if (!product) {
    notFound()
  }

  const settings = await prisma.storeSettings.findFirst()
  
  // Montar link do WhatsApp dinâmico
  const whatsappNumber = settings?.whatsappNumber || "5511999999999" // Fallback
  const currentPrice = product.isPromo && product.promoPrice ? product.promoPrice : product.price
  let whatsappText = settings?.whatsappMsg || "Olá, gostaria de saber mais sobre [NOME DO PRODUTO] no valor de R$ [VALOR]."
  
  whatsappText = whatsappText
    .replace("[NOME DO PRODUTO]", product.name)
    .replace("[VALOR]", currentPrice.toString().replace(".", ","))

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a loja
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Lado Esquerdo: Galeria */}
        <div>
          <ProductGallery 
            mainImage={product.mainImage} 
            additionalImages={product.images}
            altText={product.name}
          />
        </div>

        {/* Lado Direito: Detalhes */}
        <div className="flex flex-col">
          <div className="mb-6 space-y-2">
            <Link href={`/categoria/${product.category.slug}`}>
              <Badge variant="outline" className="text-xs uppercase tracking-wider mb-2">
                {product.category.name}
              </Badge>
            </Link>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>
          </div>

          <div className="mb-8 flex items-baseline gap-4">
            {product.isPromo && product.promoPrice ? (
              <>
                <span className="text-3xl font-bold text-primary">R$ {product.promoPrice.toString().replace('.', ',')}</span>
                <span className="text-xl text-muted-foreground line-through">R$ {product.price.toString().replace('.', ',')}</span>
                <Badge className="bg-rose-500 hover:bg-rose-600 border-none text-white ml-2 text-sm shadow-sm">
                  Promoção
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-foreground">R$ {product.price.toString().replace('.', ',')}</span>
            )}
          </div>

          <div className="mb-10 text-lg text-muted-foreground leading-relaxed">
            {product.shortDesc}
          </div>

          <div className="mb-12">
            {whatsappNumber && product.isAvailable ? (
              <Link href={whatsappUrl} target="_blank" className="w-full">
                <Button size="lg" className="w-full text-lg h-14 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                  Comprar pelo WhatsApp
                </Button>
              </Link>
            ) : !product.isAvailable ? (
              <Button size="lg" disabled className="w-full text-lg h-14 rounded-full bg-zinc-200 text-zinc-500 cursor-not-allowed">
                Produto Esgotado
              </Button>
            ) : null}
            <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
              Atendimento personalizado. Estoque de {product.stock} unidades.
            </p>
          </div>

          {/* Descrição Completa (se houver) */}
          {(product.fullDesc || product.sku || product.brand || product.material || product.colors || product.weight || product.height || product.width || product.depth) && (
            <div className="border-t pt-8 mt-4">
              <h3 className="font-serif text-xl font-bold mb-4">Detalhes do Produto</h3>
              
              {product.fullDesc && (
                <div className="prose prose-stone text-muted-foreground mb-6">
                  <p className="whitespace-pre-line leading-relaxed">{product.fullDesc}</p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                {product.sku && (
                  <div><span className="font-semibold text-foreground">SKU:</span> {product.sku}</div>
                )}
                {product.brand && (
                  <div><span className="font-semibold text-foreground">Marca:</span> {product.brand}</div>
                )}
                {product.material && (
                  <div><span className="font-semibold text-foreground">Material:</span> {product.material}</div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div><span className="font-semibold text-foreground">Cores:</span> {product.colors.join(", ")}</div>
                )}
                {product.weight && (
                  <div><span className="font-semibold text-foreground">Peso:</span> {product.weight}</div>
                )}
                {product.height && (
                  <div><span className="font-semibold text-foreground">Altura:</span> {product.height}</div>
                )}
                {product.width && (
                  <div><span className="font-semibold text-foreground">Largura:</span> {product.width}</div>
                )}
                {product.depth && (
                  <div><span className="font-semibold text-foreground">Profundidade:</span> {product.depth}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
