"use client"

import { useActionState } from "react"
import { createCategory } from "@/actions/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NovaCategoriaPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createCategory, null)

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
          <h1 className="text-3xl font-bold tracking-tight">Nova Categoria</h1>
          <p className="text-muted-foreground">Adicione uma nova categoria de produtos.</p>
        </div>
      </div>

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Detalhes da Categoria</CardTitle>
            <CardDescription>Preencha as informações básicas da categoria.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria <span className="text-destructive">*</span></Label>
              <Input id="name" name="name" placeholder="Ex: Bolsas de Couro" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" placeholder="Breve descrição da categoria..." />
            </div>

            {state?.error && (
              <div className="text-sm font-medium text-destructive mt-2">
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
