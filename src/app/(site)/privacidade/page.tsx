import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Política de Privacidade | Karol Bolsas",
  description: "Política de Privacidade da Karol Bolsas.",
}

export default function PrivacidadePage() {
  return (
    <div className="container py-8 max-w-3xl">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a página inicial
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      
      <div className="prose prose-sm sm:prose-base dark:prose-invert">
        <p>Sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Coleta de Informações</h2>
        <p>Como operamos principalmente como uma vitrine, não exigimos criação de conta para navegar. As informações pessoais (como nome e endereço de entrega) só serão solicitadas durante o atendimento via WhatsApp para a conclusão do pedido.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Uso das Informações</h2>
        <p>As informações fornecidas via WhatsApp são utilizadas exclusivamente para o processamento do seu pedido e entrega.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Segurança</h2>
        <p>Não armazenamos dados de cartão de crédito no nosso site, visto que a transação ocorre fora da plataforma web.</p>
      </div>
    </div>
  )
}
