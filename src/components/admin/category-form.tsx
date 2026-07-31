"use client"

import { useActionState, useEffect } from "react"
import { createCategory, updateCategory } from "@/actions/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export type CategoryFormProps = {
  initialData?: {
    id: string
    name: string
    slug: string
    description?: string | null
    imageUrl?: string | null
    menuLabel?: string | null
    isActive: boolean
    showInMainMenu: boolean
    showOnHome: boolean
    order: number
    sortOrder: number
    parentId?: string | null
  }
  parentCategories?: { id: string, name: string }[]
}

export function CategoryForm({ initialData, parentCategories = [] }: CategoryFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const actionToUse = isEdit ? updateCategory : createCategory
  
  const [state, formAction, isPending] = useActionState(actionToUse, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/categorias")
    }
  }, [state, router])

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categorias">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEdit ? "Editar Categoria" : "Nova Categoria"}</h1>
          <p className="text-muted-foreground">{isEdit ? "Edite as informações da categoria." : "Adicione uma nova categoria de produtos."}</p>
        </div>
      </div>

      <Card>
        <form action={formAction}>
          {isEdit && <input type="hidden" name="id" value={initialData.id} />}
          <CardHeader>
            <CardTitle>Detalhes da Categoria</CardTitle>
            <CardDescription>Preencha as informações básicas da categoria.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria <span className="text-destructive">*</span></Label>
              <Input id="name" name="name" defaultValue={initialData?.name} placeholder="Ex: Bolsas de Couro" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Opcional - Gerado automaticamente)</Label>
              <Input id="slug" name="slug" defaultValue={initialData?.slug} placeholder="bolsas-de-couro" />
              <p className="text-xs text-muted-foreground">Deixe em branco para gerar a partir do nome.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" defaultValue={initialData?.description || ""} placeholder="Breve descrição da categoria..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Categoria Pai</Label>
              <select 
                id="parentId" 
                name="parentId" 
                defaultValue={initialData?.parentId || "none"}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="none">Nenhuma (Categoria Principal)</option>
                {parentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
              <Input id="imageUrl" name="imageUrl" defaultValue={initialData?.imageUrl || ""} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="menuLabel">Label no Menu (Opcional)</Label>
              <Input id="menuLabel" name="menuLabel" defaultValue={initialData?.menuLabel || ""} placeholder="Ex: NOVO" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" name="isActive" defaultChecked={initialData?.isActive ?? true} className="w-4 h-4 rounded border-gray-300" />
                <Label htmlFor="isActive" className="cursor-pointer">Categoria Ativa</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showInMainMenu" name="showInMainMenu" defaultChecked={initialData?.showInMainMenu ?? false} className="w-4 h-4 rounded border-gray-300" />
                <Label htmlFor="showInMainMenu" className="cursor-pointer">Mostrar no Menu Superior</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showOnHome" name="showOnHome" defaultChecked={initialData?.showOnHome ?? true} className="w-4 h-4 rounded border-gray-300" />
                <Label htmlFor="showOnHome" className="cursor-pointer">Mostrar na Home</Label>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="sortOrder">Ordem de Exibição (0 é o primeiro)</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={initialData?.sortOrder ?? (initialData?.order ?? 0)} min="0" required />
            </div>

            {state?.error && (
              <div className="text-sm font-medium text-destructive mt-2 p-3 bg-destructive/10 rounded-md">
                {state.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Link href="/admin/categorias">
              <Button variant="ghost" type="button">Cancelar</Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Categoria"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
