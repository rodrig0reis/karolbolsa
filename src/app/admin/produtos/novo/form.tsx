"use client"

import { useActionState, useEffect } from "react"
import { createProduct } from "@/actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NovoProdutoPage({
  categorias
}: {
  categorias: { id: string, name: string }[]
}) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createProduct, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/produtos")
    }
  }, [state, router])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/produtos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
          <p className="text-muted-foreground">Cadastre uma nova bolsa ou acessório.</p>
        </div>
      </div>

      <form action={formAction}>
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
                <Input id="name" name="name" placeholder="Ex: Bolsa Transversal Couro" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoria <span className="text-destructive">*</span></Label>
                <select 
                  id="categoryId" 
                  name="categoryId" 
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) <span className="text-destructive">*</span></Label>
                  <Input id="price" name="price" placeholder="299,90" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promoPrice">Preço Promocional (R$)</Label>
                  <Input id="promoPrice" name="promoPrice" placeholder="249,90" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Estoque Inicial</Label>
                <Input id="stock" name="stock" type="number" defaultValue="10" min="0" />
              </div>
            </CardContent>
          </Card>

          {/* Descrição e Mídia */}
          <Card>
            <CardHeader>
              <CardTitle>Mídia e Descrição</CardTitle>
              <CardDescription>Imagens e detalhes do produto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainImage">Imagem Principal <span className="text-destructive">*</span></Label>
                <Input id="mainImage" name="mainImage" type="file" accept="image/*" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalImages">Imagens Adicionais (Opcional)</Label>
                <Input id="additionalImages" name="additionalImages" type="file" accept="image/*" multiple />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDesc">Descrição Curta <span className="text-destructive">*</span></Label>
                <Input id="shortDesc" name="shortDesc" placeholder="Breve resumo..." required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDesc">Descrição Completa</Label>
                <textarea 
                  id="fullDesc" 
                  name="fullDesc" 
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Detalhes completos, material, medidas..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isFeatured" name="isFeatured" className="w-4 h-4 rounded border-gray-300" />
                  <Label htmlFor="isFeatured" className="cursor-pointer">Produto em Destaque</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isPromo" name="isPromo" className="w-4 h-4 rounded border-gray-300" />
                  <Label htmlFor="isPromo" className="cursor-pointer">Em Promoção</Label>
                </div>
              </div>

              {state?.error && (
                <div className="text-sm font-medium text-destructive mt-4">
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
            {isPending ? "Salvando e enviando imagens..." : "Salvar Produto"}
          </Button>
        </div>
      </form>
    </div>
  )
}
