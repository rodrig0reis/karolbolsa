import { prisma } from "@/lib/prisma"
import SettingsForm from "./form"

export default async function ConfiguracoesPage() {
  const settings = await prisma.storeSettings.findFirst()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações da Loja</h1>
        <p className="text-muted-foreground">Gerencie informações de contato, redes sociais e textos da loja.</p>
      </div>

      <SettingsForm initialData={settings} />
    </div>
  )
}
