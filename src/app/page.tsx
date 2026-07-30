import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categoriasMock = [
  { nome: "Bolsas Transversais", slug: "bolsas-transversais" },
  { nome: "Bolsas de Mão", slug: "bolsas-de-mao" },
  { nome: "Mochilas", slug: "mochilas" },
  { nome: "Carteiras", slug: "carteiras" },
  { nome: "Acessórios", slug: "acessorios" },
]

const produtosMock = [
  {
    id: "1",
    nome: "Bolsa Elegance Nude",
    preco: "299,90",
    promo: "249,90",
    imagem: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
    categoria: "Bolsas Transversais"
  },
  {
    id: "2",
    nome: "Mochila Couro Classic",
    preco: "359,90",
    promo: null,
    imagem: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
    categoria: "Mochilas"
  },
  {
    id: "3",
    nome: "Carteira Minimalista",
    preco: "89,90",
    promo: null,
    imagem: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
    categoria: "Carteiras"
  },
  {
    id: "4",
    nome: "Bolsa de Mão Glamour",
    preco: "429,90",
    promo: "399,90",
    imagem: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop",
    categoria: "Bolsas de Mão"
  },
]

export default function Home() {
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
            <Button size="lg" className="rounded-full px-8 text-base h-12 shadow-md">
              Ver Coleção
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80">
              Promoções
            </Button>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-center mb-10">Compre por Categoria</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categoriasMock.map((cat) => (
            <Link key={cat.slug} href={`/categoria/${cat.slug}`}>
              <Button variant="secondary" className="rounded-full px-6 py-6 shadow-sm hover:shadow-md transition-all text-sm font-medium">
                {cat.nome}
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
          {produtosMock.map((produto) => (
            <Card key={produto.id} className="group overflow-hidden border-border/50 bg-background hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
              <Link href={`/produto/${produto.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {produto.promo && (
                    <Badge className="absolute top-3 left-3 z-10 bg-rose-500 hover:bg-rose-600 text-white shadow-sm border-none">
                      Promoção
                    </Badge>
                  )}
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="text-xs text-muted-foreground mb-2">{produto.categoria}</div>
                  <h3 className="font-medium text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {produto.nome}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-3">
                    {produto.promo ? (
                      <>
                        <span className="text-lg font-bold text-primary">R$ {produto.promo}</span>
                        <span className="text-sm text-muted-foreground line-through">R$ {produto.preco}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-foreground">R$ {produto.preco}</span>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
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
            <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/5">
              Conheça nossa história
            </Button>
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
