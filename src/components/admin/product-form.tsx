"use client"

import { useActionState, useEffect } from "react"
import { createProduct, updateProduct } from "@/actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export type ProductFormProps = {
  categorias: { id: string, name: string, parentId?: string | null }[]
  initialData?: {
    id: string
    name: string
    sku?: string | null
    brand?: string | null
    categoryId: string
    price: string | number
    promoPrice?: string | number | null
    stock: number
    isActive: boolean
    isAvailable: boolean
    isFeatured: boolean
    isPromo: boolean
    mainImage?: string | null
    shortDesc: string
    fullDesc?: string | null
    material?: string | null
    colors?: string[]
    weight?: string | null
    height?: string | null
    width?: string | null
    depth?: string | null
  }
}

export function ProductForm({ categorias, initialData }: ProductFormProps) {
  const router = useRouter()
  
  // Decide action based on whether we have initialData
  const actionToUse = initialData ? updateProduct : createProduct
  
  // Create state with the bound action
  const [state, formAction, isPending] = useActionState(actionToUse, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/produtos")
    }
  }, [state, router])

  const isEdit = !!initialData

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/produtos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEdit ? "Editar Produto" : "Novo Produto"}</h1>
          <p className="text-muted-foreground">{isEdit ? "Edite as informações da bolsa ou acessório." : "Cadastre uma nova bolsa ou acessório."}</p>
        </div>
      </div>

      <form action={formAction}>
        {isEdit && <input type="hidden" name="id" value={initialData.id} />}
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Principais</CardTitle>
              <CardDescription>Detalhes básicos do produto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" defaultValue={initialData?.name} placeholder="Ex: Bolsa Transversal Couro" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" defaultValue={initialData?.sku || ""} placeholder="EX-123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" name="brand" defaultValue={initialData?.brand || ""} placeholder="Marca" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria <span className="text-destructive">*</span></Label>
                <select 
                  id="categoryId" 
                  name="categoryId" 
                  defaultValue={initialData?.categoryId || ""}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  
                  {(() => {
                    const mains = categorias.filter(c => !c.parentId);
                    const children = categorias.filter(c => c.parentId);
                    
                    return mains.map(main => (
                      <optgroup key={main.id} label={main.name}>
                        <option value={main.id}>{main.name} (Geral)</option>
                        {children.filter(c => c.parentId === main.id).map(child => (
                          <option key={child.id} value={child.id}>{child.name}</option>
                        ))}
                      </optgroup>
                    ));
                  })()}
                  
                  {/* Categorias sem pai que não entraram */}
                  {categorias.filter(c => !c.parentId && !categorias.some(m => m.id === c.id)).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) <span className="text-destructive">*</span></Label>
                  <Input id="price" name="price" defaultValue={initialData?.price?.toString()} placeholder="299.90" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promoPrice">Preço Promocional (R$)</Label>
                  <Input id="promoPrice" name="promoPrice" defaultValue={initialData?.promoPrice?.toString()} placeholder="249.90" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Estoque <span className="text-destructive">*</span></Label>
                <Input id="stock" name="stock" type="number" defaultValue={initialData?.stock ?? 10} min="0" required />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-2">
                  <Label>Status de Venda</Label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" name="isActive" defaultChecked={initialData?.isActive ?? true} className="w-4 h-4 rounded border-gray-300" />
                    <Label htmlFor="isActive" className="cursor-pointer">Produto Ativo na Vitrine</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isAvailable" name="isAvailable" defaultChecked={initialData?.isAvailable ?? true} className="w-4 h-4 rounded border-gray-300" />
                    <Label htmlFor="isAvailable" className="cursor-pointer">Em Estoque (Disponível)</Label>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Destaques</Label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={initialData?.isFeatured ?? false} className="w-4 h-4 rounded border-gray-300" />
                    <Label htmlFor="isFeatured" className="cursor-pointer">Produto em Destaque</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isPromo" name="isPromo" defaultChecked={initialData?.isPromo ?? false} className="w-4 h-4 rounded border-gray-300" />
                    <Label htmlFor="isPromo" className="cursor-pointer">Em Promoção</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descrição e Mídia */}
          <Card>
            <CardHeader>
              <CardTitle>Mídia e Detalhes</CardTitle>
              <CardDescription>Imagens, descrições e especificações físicas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainImage">Imagem Principal {!isEdit && <span className="text-destructive">*</span>}</Label>
                <Input id="mainImage" name="mainImage" type="file" accept="image/jpeg, image/png, image/webp" required={!isEdit} />
                {isEdit && initialData.mainImage && (
                  <p className="text-xs text-muted-foreground mt-1">A imagem atual será mantida se nenhuma for selecionada.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalImages">Imagens Adicionais (Máx 6)</Label>
                <Input id="additionalImages" name="additionalImages" type="file" accept="image/jpeg, image/png, image/webp" multiple />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Descrição Curta <span className="text-destructive">*</span></Label>
                <Input id="shortDesc" name="shortDesc" defaultValue={initialData?.shortDesc} placeholder="Breve resumo..." required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDesc">Descrição Completa</Label>
                <textarea 
                  id="fullDesc" 
                  name="fullDesc" 
                  rows={3}
                  defaultValue={initialData?.fullDesc || ""}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Detalhes completos..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input id="material" name="material" defaultValue={initialData?.material || ""} placeholder="Ex: Couro Sintético" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colors">Cores (separadas por vírgula)</Label>
                  <Input id="colors" name="colors" defaultValue={initialData?.colors?.join(", ") || ""} placeholder="Preto, Nude, Vermelho" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso</Label>
                  <Input id="weight" name="weight" defaultValue={initialData?.weight || ""} placeholder="300g" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura</Label>
                  <Input id="height" name="height" defaultValue={initialData?.height || ""} placeholder="20cm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Largura</Label>
                  <Input id="width" name="width" defaultValue={initialData?.width || ""} placeholder="30cm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Profund.</Label>
                  <Input id="depth" name="depth" defaultValue={initialData?.depth || ""} placeholder="10cm" />
                </div>
              </div>

              {state?.error && (
                <div className="text-sm font-medium text-destructive mt-4 p-3 bg-destructive/10 rounded-md">
                  {state.error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Link href="/admin/produtos">
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Produto"}
          </Button>
        </div>
      </form>
    </div>
  )
}
