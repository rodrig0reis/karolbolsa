import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Termos de Uso | Karol Bolsas",
  description: "Termos de Uso da Karol Bolsas.",
}

export default function TermosPage() {
  return (
    <div className="container py-8 max-w-3xl">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a página inicial
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
      
      <div className="prose prose-sm sm:prose-base dark:prose-invert">
        <p>Bem-vindo à Karol Bolsas.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Aceitação dos Termos</h2>
        <p>Ao acessar e utilizar nosso site, você concorda com nossos termos e condições de uso.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Produtos e Vendas</h2>
        <p>A Karol Bolsas atua como uma vitrine virtual. A conclusão da compra e o pagamento são combinados diretamente pelo WhatsApp com nossa equipe de atendimento.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Disponibilidade de Estoque</h2>
        <p>Apesar de nossos esforços para manter o estoque atualizado no site, a disponibilidade final do produto será confirmada durante o atendimento no WhatsApp.</p>

        <h2 className="text-xl font-semibold mt-6 mb-3">4. Preços</h2>
        <p>Os preços exibidos no site estão em Reais (BRL) e podem ser alterados sem aviso prévio.</p>
      </div>
    </div>
  )
}
