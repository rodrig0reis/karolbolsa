"use client"

import { useActionState } from "react"
import { updateSettings } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { StoreSettings } from "@prisma/client"

export default function SettingsForm({ initialData }: { initialData: StoreSettings | null }) {
  const [state, formAction, isPending] = useActionState(updateSettings, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={initialData?.id || ""} />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>Nome da loja e textos principais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja <span className="text-destructive">*</span></Label>
              <Input id="storeName" name="storeName" defaultValue={initialData?.storeName} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="footerText">Texto Institucional (Rodapé)</Label>
              <textarea 
                id="footerText" 
                name="footerText" 
                rows={3}
                defaultValue={initialData?.footerText || ""}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato e Redes Sociais</CardTitle>
            <CardDescription>Links e informações de atendimento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Número do WhatsApp (apenas números)</Label>
                <Input id="whatsappNumber" name="whatsappNumber" placeholder="Ex: 11999999999" defaultValue={initialData?.whatsappNumber || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Contato</Label>
                <Input id="email" name="email" type="email" placeholder="contato@karolbolsas.com.br" defaultValue={initialData?.email || ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappMsg">Mensagem Padrão do WhatsApp</Label>
              <Input id="whatsappMsg" name="whatsappMsg" defaultValue={initialData?.whatsappMsg || ""} />
              <p className="text-xs text-muted-foreground">
                Dica: Use [NOME DO PRODUTO] e [VALOR] para variáveis dinâmicas se o usuário clicar no botão de compra.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramLink">Link do Instagram</Label>
              <Input id="instagramLink" name="instagramLink" placeholder="https://instagram.com/..." defaultValue={initialData?.instagramLink || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours">Horário de Atendimento</Label>
              <Input id="workingHours" name="workingHours" placeholder="Seg a Sex, das 09h às 18h" defaultValue={initialData?.workingHours || ""} />
            </div>

            {state?.error && (
              <div className="text-sm font-medium text-destructive mt-4">
                {state.error}
              </div>
            )}
            
            {state?.success && (
              <div className="text-sm font-medium text-emerald-600 mt-4">
                {state.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-6 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
