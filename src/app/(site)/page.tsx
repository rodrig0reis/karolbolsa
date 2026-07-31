import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/public/product-card"
import { prisma } from "@/lib/prisma"
import { buildProductWhatsAppUrl } from "@/lib/utils"

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const categorias = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  const produtos = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 4,
  })

  const settings = await prisma.storeSettings.findFirst()
  const whatsappNumber = settings?.whatsappNumber
  const generalWhatsappUrl = whatsappNumber 
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá, vim pelo site da Karol Bolsas e gostaria de atendimento.")}` 
    : "/contato"

  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Banner Principal */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/banners/banner-karol-bolsas-praia.jpg" 
            alt="Karol Bolsas - Moda Feminina em Pirangi" 
            fill
            sizes="100vw"
            className="object-cover object-center opacity-70"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">
            Karol Bolsas
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto font-medium drop-shadow-sm">
            Bolsas femininas, acessórios e estilo praiano em Pirangi do Norte/RN.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produtos">
              <Button size="lg" className="rounded-full px-8 text-base h-12 shadow-md w-full sm:w-auto">
                Ver produtos
              </Button>
            </Link>
            <Link href={generalWhatsappUrl} target={whatsappNumber ? "_blank" : undefined}>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12 bg-white/10 text-white border-white/30 hover:bg-white/20 w-full sm:w-auto backdrop-blur-sm">
                Falar no WhatsApp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges / Diferenciais */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-background rounded-2xl shadow-lg border p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-serif">📞</div>
              <h3 className="text-sm font-semibold">Atendimento pelo WhatsApp</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-serif">⭐</div>
              <h3 className="text-sm font-semibold">Produtos selecionados</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-serif">🏖️</div>
              <h3 className="text-sm font-semibold">Estilo praia e casual</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-serif">📍</div>
              <h3 className="text-sm font-semibold">Loja em Pirangi do Norte/RN</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-0 md:px-4">
        <h2 className="font-serif text-3xl font-bold text-center mb-10 px-4">Compre por Categoria</h2>
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap px-4 pb-4 md:flex-wrap md:justify-center scrollbar-hide">
          {categorias.map((cat) => (
            <Link key={cat.slug} href={`/categoria/${cat.slug}`}>
              <Button variant="secondary" className="rounded-full px-6 h-12 shadow-sm hover:shadow-md transition-all text-sm font-medium">
                {cat.name}
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold">Lançamentos</h2>
          <Link href="/produtos" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
              stock={produto.stock}
              categoryName={produto.category.name}
              whatsappUrl={whatsappNumber ? buildProductWhatsAppUrl(whatsappNumber, produto.name, produto.isPromo && produto.promoPrice ? produto.promoPrice : produto.price) : undefined}
            />
          ))}
        </div>
      </section>

      {/* Prova Social */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="font-serif text-3xl font-bold text-center mb-10">Clientes que amam a Karol Bolsas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/20 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
            <div className="text-yellow-500 text-lg">★★★★★</div>
            <p className="text-muted-foreground italic">"Atendimento excelente e bolsas lindas. Comprei para usar na viagem e amei."</p>
            <p className="font-semibold text-sm">— Cliente Karol Bolsas</p>
          </div>
          <div className="bg-secondary/20 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
            <div className="text-yellow-500 text-lg">★★★★★</div>
            <p className="text-muted-foreground italic">"Produto chegou bem embalado e exatamente como eu queria."</p>
            <p className="font-semibold text-sm">— Cliente Karol Bolsas</p>
          </div>
          <div className="bg-secondary/20 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
            <div className="text-yellow-500 text-lg">★★★★★</div>
            <p className="text-muted-foreground italic">"A bolsa é charmosa, leve e combina muito com looks de praia."</p>
            <p className="font-semibold text-sm">— Cliente Karol Bolsas</p>
          </div>
        </div>
      </section>

      {/* Bloco Institucional */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-secondary/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">Feitas para mulheres que inspiram.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Na Karol Bolsas, acreditamos que uma bolsa é mais do que um acessório, é uma extensão da sua personalidade. Trabalhamos com materiais de alta qualidade para entregar peças únicas que acompanham você em todos os momentos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href={generalWhatsappUrl} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer">
                <Button className="w-full sm:w-auto rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all text-base font-medium">
                  Falar no WhatsApp
                </Button>
              </Link>
              <Link href="https://www.instagram.com/karolbolsas_artesanais/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto rounded-full border-primary/30 text-primary hover:bg-primary/5 px-8 h-12 text-base font-medium transition-all">
                  Ver Instagram
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden">
            <Image 
              src="/products/bolsa-praia-palha-natural-pirangi.jpg" 
              alt="Sobre a Karol Bolsas"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  )
}
