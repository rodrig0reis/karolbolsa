import { getStoreSettingsUncached } from "@/lib/settings"
import { SettingsClient } from "./settings-client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SettingsPage() {
  const settings = await getStoreSettingsUncached()
  
  if (!settings) {
    return <div>Erro ao carregar configurações. O banco de dados pode não estar inicializado.</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Central de Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie todas as informações, aparência e integrações do site.
        </p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  )
}
