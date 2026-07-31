"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SettingsSection } from "@/components/admin/settings-section"
import { Save, Loader2, Store, Phone, Share2, Paintbrush, Globe, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { PasswordChangeModal } from "./password-modal"
import { UsersManagement } from "./users-management"

export function SettingsClient({ 
  initialSettings, 
  currentUserId, 
  role 
}: { 
  initialSettings: any
  currentUserId: string
  role: string
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    // Tratamento manual para checkbox/switch que não enviam valor quando desmarcados
    formData.set("floatWhatsapp", formData.get("floatWhatsapp") === "on" ? "true" : "false")
    formData.set("allowIndexing", formData.get("allowIndexing") === "on" ? "true" : "false")

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Configurações salvas com sucesso!" })
        router.refresh()
      } else {
        setMessage({ type: "error", text: "Erro ao salvar as configurações." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro inesperado de conexão." })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <Tabs defaultValue="geral" className="w-full">
        <div className="overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <TabsList className="w-max inline-flex">
            <TabsTrigger value="geral" className="gap-2"><Store className="h-4 w-4" /> Geral</TabsTrigger>
            <TabsTrigger value="whatsapp" className="gap-2"><Phone className="h-4 w-4" /> WhatsApp</TabsTrigger>
            <TabsTrigger value="redes" className="gap-2"><Share2 className="h-4 w-4" /> Redes Sociais</TabsTrigger>
            <TabsTrigger value="aparencia" className="gap-2"><Paintbrush className="h-4 w-4" /> Aparência</TabsTrigger>
            <TabsTrigger value="seo" className="gap-2"><Globe className="h-4 w-4" /> SEO</TabsTrigger>
            <TabsTrigger value="seguranca" className="gap-2"><Shield className="h-4 w-4" /> Segurança</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="geral" className="space-y-6">
          <SettingsSection title="Informações Básicas" description="Dados principais que identificam a sua loja.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input id="storeName" name="storeName" defaultValue={initialSettings.storeName} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan (Frase de efeito)</Label>
                <Input id="slogan" name="slogan" defaultValue={initialSettings.slogan || ""} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="shortDesc">Descrição Curta</Label>
                <Textarea id="shortDesc" name="shortDesc" defaultValue={initialSettings.shortDesc || ""} rows={2} />
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Contato e Localização" description="Onde e como seus clientes podem te encontrar.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Público</Label>
                <Input id="email" name="email" type="email" defaultValue={initialSettings.email || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone Fixo (Opcional)</Label>
                <Input id="phone" name="phone" defaultValue={initialSettings.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade / Bairro</Label>
                <Input id="city" name="city" defaultValue={initialSettings.city || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado (UF)</Label>
                <Input id="state" name="state" defaultValue={initialSettings.state || ""} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="workingHours">Horário de Atendimento</Label>
                <Input id="workingHours" name="workingHours" defaultValue={initialSettings.workingHours || ""} placeholder="Ex: Seg a Sex das 09h às 18h" />
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <SettingsSection title="Integração do WhatsApp" description="Configure as mensagens padrão que chegam para você.">
            <div className="space-y-6">
              <div className="space-y-2 max-w-sm">
                <Label htmlFor="whatsappNumber">Número do WhatsApp (Apenas números com DDD)</Label>
                <Input id="whatsappNumber" name="whatsappNumber" defaultValue={initialSettings.whatsappNumber || ""} placeholder="Ex: 5584999999999" />
              </div>
              
              <div className="flex items-center space-x-2 bg-muted/50 p-4 rounded-lg border">
                <Switch 
                  id="floatWhatsapp" 
                  name="floatWhatsapp" 
                  defaultChecked={initialSettings.floatWhatsapp} 
                />
                <Label htmlFor="floatWhatsapp" className="font-semibold cursor-pointer">
                  Exibir botão flutuante do WhatsApp em todas as páginas
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappGeneralMsg">Mensagem Geral (Botão Flutuante e Contato)</Label>
                <Textarea id="whatsappGeneralMsg" name="whatsappGeneralMsg" defaultValue={initialSettings.whatsappGeneralMsg || ""} rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappMsg">Mensagem de Produto Específico</Label>
                <Textarea id="whatsappMsg" name="whatsappMsg" defaultValue={initialSettings.whatsappMsg || ""} rows={3} />
                <p className="text-xs text-muted-foreground">
                  Use as variáveis: <code className="bg-muted px-1 py-0.5 rounded">{`{produto}`}</code>, <code className="bg-muted px-1 py-0.5 rounded">{`{preco}`}</code> para preenchimento dinâmico.
                </p>
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="redes" className="space-y-6">
          <SettingsSection title="Redes Sociais" description="Links para os perfis da sua marca.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instagramLink">Instagram URL</Label>
                <Input id="instagramLink" name="instagramLink" defaultValue={initialSettings.instagramLink || ""} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookLink">Facebook URL</Label>
                <Input id="facebookLink" name="facebookLink" defaultValue={initialSettings.facebookLink || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktokLink">TikTok URL</Label>
                <Input id="tiktokLink" name="tiktokLink" defaultValue={initialSettings.tiktokLink || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinterestLink">Pinterest URL</Label>
                <Input id="pinterestLink" name="pinterestLink" defaultValue={initialSettings.pinterestLink || ""} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="linktreeLink">Linktree ou Bio URL</Label>
                <Input id="linktreeLink" name="linktreeLink" defaultValue={initialSettings.linktreeLink || ""} />
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-6">
          <SettingsSection title="Logotipos e Identidade" description="As imagens principais da sua marca (Digite a URL da imagem por enquanto).">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo Principal (Header)</Label>
                <Input id="logoUrl" name="logoUrl" defaultValue={initialSettings.logoUrl || ""} placeholder="/logo.png" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerLogoUrl">Logo do Rodapé (Opaco/Branco)</Label>
                <Input id="footerLogoUrl" name="footerLogoUrl" defaultValue={initialSettings.footerLogoUrl || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon (Ícone da Aba do Navegador)</Label>
                <Input id="faviconUrl" name="faviconUrl" defaultValue={initialSettings.faviconUrl || ""} />
              </div>
            </div>
          </SettingsSection>
          
          <SettingsSection title="Rodapé Institucional" description="Configuração do footer do site.">
            <div className="space-y-2">
              <Label htmlFor="footerText">Texto Institucional (Quem Somos Resumido)</Label>
              <Textarea id="footerText" name="footerText" defaultValue={initialSettings.footerText || ""} rows={4} />
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SettingsSection title="Otimização para Buscadores (Google)" description="Como o seu site aparece no Google e ao compartilhar links.">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 bg-muted/50 p-4 rounded-lg border">
                <Switch 
                  id="allowIndexing" 
                  name="allowIndexing" 
                  defaultChecked={initialSettings.allowIndexing} 
                />
                <Label htmlFor="allowIndexing" className="font-semibold cursor-pointer">
                  Permitir que o Google indexe a loja
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoTitle">Título SEO Padrão</Label>
                <Input id="seoTitle" name="seoTitle" defaultValue={initialSettings.seoTitle || ""} placeholder="Ex: Karol Bolsas | Moda Feminina em Pirangi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Descrição SEO Padrão</Label>
                <Textarea id="seoDescription" name="seoDescription" defaultValue={initialSettings.seoDescription || ""} rows={3} placeholder="Descrição curta sobre a loja para o Google..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Palavras-chave (Separadas por vírgula)</Label>
                <Input id="seoKeywords" name="seoKeywords" defaultValue={initialSettings.seoKeywords || ""} placeholder="bolsas artesanais, moda praia, bolsas de palha..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ogImageUrl">Imagem de Compartilhamento Padrão (Open Graph)</Label>
                <Input id="ogImageUrl" name="ogImageUrl" defaultValue={initialSettings.ogImageUrl || ""} placeholder="/og-image.jpg" />
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <SettingsSection title="Credenciais do Administrador" description="Essas opções estão disponíveis na área de gerenciamento global. A edição de perfil completo será ativada em breve.">
             <div className="bg-card border rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">Alteração de Senha</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Atualize a senha utilizada para acessar este painel administrativo. Recomenda-se uma senha forte.
                  </p>
                </div>
                <div>
                  <PasswordChangeModal />
                </div>
             </div>
          </SettingsSection>

          {role === "ADMIN" && (
            <SettingsSection title="Gestão de Acessos" description="Adicione ou remova membros da equipe.">
              <UsersManagement currentUserId={currentUserId} />
            </SettingsSection>
          )}
        </TabsContent>
      </Tabs>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card/80 backdrop-blur-md border-t p-4 flex items-center justify-between z-40 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)]">
        <div>
          {message && (
            <p className={cn("text-sm font-medium", message.type === "success" ? "text-emerald-600" : "text-destructive")}>
              {message.text}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSaving} className="shadow-lg min-w-[150px]">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
