import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ProductGallery } from "./gallery"
import { formatCurrency, buildProductWhatsAppUrl } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
  })

  if (!product) {
    return {
      title: "Produto não encontrado | Karol Bolsas",
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karolbolsas.manialivre.com.br"
  
  let imageUrl = product.mainImage
    ? (product.mainImage.startsWith("http") ? product.mainImage : `${siteUrl}${product.mainImage}`)
    : `${siteUrl}/og-karol-bolsas.jpg`
    
  // Forçar atualização do cache do WhatsApp
  if (imageUrl.includes('?')) {
    imageUrl += '&v=20260731'
  } else {
    imageUrl += '?v=20260731'
  }
  const desc = product.shortDesc || product.fullDesc || "Produto Karol Bolsas"

  return {
    title: `${product.name} | Karol Bolsas`,
    description: desc,
    openGraph: {
      title: `${product.name} | Karol Bolsas`,
      description: desc,
      url: `${siteUrl}/produto/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Karol Bolsas`,
      description: desc,
      images: [imageUrl],
    }
  }
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug, isActive: true },
    include: {
      category: {
        include: { parent: true }
      },
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
  const whatsappUrl = whatsappNumber 
    ? buildProductWhatsAppUrl(whatsappNumber, product.name, currentPrice)
    : ""

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karolbolsas.manialivre.com.br"
  const absoluteProductImageUrl = product.mainImage 
    ? (product.mainImage.startsWith("http") ? product.mainImage : `${siteUrl}${product.mainImage}`)
    : `${siteUrl}/og-karol-bolsas.jpg`

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.shortDesc || product.fullDesc || "Produto Karol Bolsas",
    "image": [absoluteProductImageUrl],
    "brand": {
      "@type": "Brand",
      "name": "Karol Bolsas"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/produto/${product.slug}`,
      "priceCurrency": "BRL",
      "price": currentPrice,
      "availability": (product.stock > 0 && product.isAvailable) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  }

  return (
    <>
      <div 
        className="container mx-auto px-4 md:px-6 py-8 md:py-12"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 112px)' }}
      >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          </li>
          <li><span className="opacity-50">/</span></li>
          {product.category.parent && (
            <>
              <li>
                <Link href={`/categoria/${product.category.parent.slug}`} className="hover:text-primary transition-colors">
                  {product.category.parent.name}
                </Link>
              </li>
              <li><span className="opacity-50">/</span></li>
            </>
          )}
          <li>
            <Link href={`/categoria/${product.category.slug}`} className="hover:text-primary transition-colors">
              {product.category.name}
            </Link>
          </li>
          <li><span className="opacity-50">/</span></li>
          <li className="text-foreground font-medium" aria-current="page">{product.name}</li>
        </ol>
      </nav>

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
                <span className="text-3xl font-bold text-primary">{formatCurrency(product.promoPrice)}</span>
                <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                <Badge className="bg-rose-500 hover:bg-rose-600 border-none text-white ml-2 text-sm shadow-sm">
                  Promoção
                </Badge>
              </>
            ) : (
              <span className="text-3xl font-bold text-foreground">{formatCurrency(product.price)}</span>
            )}
          </div>

          <div className="mb-10 text-lg text-muted-foreground leading-relaxed">
            {product.shortDesc}
          </div>

          <div className="mb-12">
            {whatsappNumber && product.isAvailable && product.stock > 0 ? (
              <Link href={whatsappUrl} target="_blank" className="w-full">
                <Button size="lg" className="w-full text-lg h-14 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                  Comprar pelo WhatsApp
                </Button>
              </Link>
            ) : (!product.isAvailable || product.stock <= 0) ? (
              <Button size="lg" disabled className="w-full text-lg h-14 rounded-full bg-zinc-200 text-zinc-500 cursor-not-allowed">
                Produto Esgotado
              </Button>
            ) : null}
            <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
              Atendimento personalizado. {product.stock > 0 ? `Estoque de ${product.stock} unidades.` : ""}
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

      {/* Barra Fixa Mobile */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border/50 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Preço</span>
            <span className="text-xl font-bold text-foreground">
              {formatCurrency(currentPrice)}
            </span>
          </div>
          <div className="flex-1">
            {whatsappNumber && product.isAvailable && product.stock > 0 ? (
              <Link href={whatsappUrl} target="_blank" className="w-full">
                <Button className="w-full h-14 rounded-full flex items-center justify-center text-center whitespace-nowrap px-2 min-[390px]:px-4 text-sm font-medium shadow-md bg-emerald-600 hover:bg-emerald-700 text-white min-w-0" aria-label="Comprar pelo WhatsApp">
                  <span className="sm:hidden">Comprar</span>
                  <span className="hidden sm:inline">Comprar pelo WhatsApp</span>
                </Button>
              </Link>
            ) : (
              <Button disabled className="w-full h-14 rounded-full flex items-center justify-center text-center px-4 text-sm bg-zinc-200 text-zinc-500 font-medium cursor-not-allowed">
                Esgotado
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
