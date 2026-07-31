import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SettingsSection } from "@/components/admin/settings-section"
import { ImageUploadPreview } from "@/components/admin/image-upload-preview"
import { getAdminSession } from "@/lib/admin-session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function NovoBannerPage() {
  const session = await getAdminSession()

  async function createBannerAction(formData: FormData) {
    "use server"
    
    // Auth validation on the server action
    if (!session || String(session.role).toUpperCase() !== "ADMIN") return
    
    const title = formData.get("title") as string
    const subtitle = formData.get("subtitle") as string
    const buttonText = formData.get("buttonText") as string
    const buttonLink = formData.get("buttonLink") as string
    const position = formData.get("position") as string || "home"
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
    const isActive = formData.get("isActive") === "on"
    
    // In a real scenario with Vercel/S3 we'd handle the file here.
    // For local MVP, we expect imageUrl as string or we mock it if file uploaded.
    // To simplify, let's accept a text URL for MVP or just a fixed placeholder if it's a file.
    let imageUrl = formData.get("imageUrl") as string
    const imageFile = formData.get("imageFile") as File
    
    if (imageFile && imageFile.size > 0) {
      // Fake saving file logic -> just set a generic path for now since we don't have fs.writeFile configured in this action
      // To properly save to /public, we'd need fs/promises. 
      // Let's use a dummy or what we already have for now, or just rely on manual URL input.
    }

    if (!imageUrl && (!imageFile || imageFile.size === 0)) {
      imageUrl = "/bolsa_elegance_nude_1785434869288.jpg" // fallback default
    }

    await prisma.banner.create({
      data: {
        title,
        subtitle,
        buttonText,
        buttonLink,
        position,
        sortOrder,
        isActive,
        imageUrl
      }
    })

    redirect("/admin/banners")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/banners" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Criar Novo Banner</h1>
      </div>

      <form action={createBannerAction} className="space-y-6">
        <SettingsSection title="Mídia do Banner" description="A imagem de fundo que será exibida.">
          <div className="space-y-4">
            <ImageUploadPreview name="imageFile" label="Upload da Imagem (Em breve: upload real, por enquanto digite a URL abaixo)" />
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem Existente (Temporário)</Label>
              <Input id="imageUrl" name="imageUrl" placeholder="/exemplo.jpg" />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Conteúdo" description="Textos principais do banner.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título Principal</Label>
              <Input id="title" name="title" required placeholder="Ex: Nova Coleção de Verão" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subtitle">Subtítulo (Opcional)</Label>
              <Input id="subtitle" name="subtitle" placeholder="Ex: Bolsas de palha com 20% OFF" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Texto do Botão (Opcional)</Label>
              <Input id="buttonText" name="buttonText" placeholder="Ex: Comprar Agora" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonLink">Link do Botão (Opcional)</Label>
              <Input id="buttonLink" name="buttonLink" placeholder="Ex: /categoria/praia" />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Configurações de Exibição">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2 bg-muted/50 p-4 rounded-lg border">
              <Switch id="isActive" name="isActive" defaultChecked={true} />
              <Label htmlFor="isActive" className="font-semibold cursor-pointer">
                Banner Ativo (Visível no site)
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordem de Exibição</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue="0" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Posição (Página)</Label>
              <Input id="position" name="position" defaultValue="home" />
            </div>
          </div>
        </SettingsSection>

        <div className="flex justify-end gap-4">
          <Link href="/admin/banners" className={cn(buttonVariants({ variant: "outline" }))}>
            Cancelar
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Salvar Banner
          </Button>
        </div>
      </form>
    </div>
  )
}
