import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/public/product-card"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

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
  return (
    <div className="flex flex-col gap-16 pb-16">
      
      {/* Banner Principal */}
      <section className="relative h-[60vh] min-h-[500px] w-full bg-muted flex items-center justify-center overflow-hidden">
        {/* Usando uma imagem da Unsplash como placeholder para o banner */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2070&auto=format&fit=crop" 
            alt="Moda Feminina Karol Bolsas" 
            fill
            sizes="100vw"
            className="object-cover object-center opacity-60"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px] z-0" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 drop-shadow-sm">
            Elegância em cada detalhe.
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mb-10 max-w-2xl mx-auto font-medium">
            Descubra a nova coleção de bolsas e acessórios que combinam perfeitamente com a sua essência.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/produtos">
              <Button size="lg" className="rounded-full px-8 text-base h-12 shadow-md">
                Ver Coleção
              </Button>
            </Link>
            <Link href="/promocoes">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80">
                Promoções
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-center mb-10">Compre por Categoria</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categorias.map((cat) => (
            <Link key={cat.slug} href={`/categoria/${cat.slug}`}>
              <Button variant="secondary" className="rounded-full px-6 py-6 shadow-sm hover:shadow-md transition-all text-sm font-medium">
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
      </section>

      {/* Bloco Institucional */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-secondary/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">Feitas para mulheres que inspiram.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Na Karol Bolsas, acreditamos que uma bolsa é mais do que um acessório, é uma extensão da sua personalidade. Trabalhamos com materiais de alta qualidade para entregar peças únicas que acompanham você em todos os momentos.
            </p>
            <Link href="/sobre">
              <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/5">
                Conheça nossa história
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop" 
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
