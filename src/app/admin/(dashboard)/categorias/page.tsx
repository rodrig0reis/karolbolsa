import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DeleteCategoryButton } from "./delete-button"
import { ToggleCategoryButton } from "./toggle-button"

export default async function CategoriasPage() {
  const categorias = await prisma.category.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { name: "asc" }
    ],
    include: {
      parent: true,
      _count: {
        select: { products: true }
      }
    }
  })

  // Organizar hierarquicamente para a view (Pai -> Filhos)
  const mainCategories = categorias.filter(c => !c.parentId)
  const orderedCategorias: typeof categorias = []

  mainCategories.forEach(main => {
    orderedCategorias.push(main)
    const children = categorias.filter(c => c.parentId === main.id)
    orderedCategorias.push(...children)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias de produtos da loja.</p>
        </div>
        <Link href="/admin/categorias/nova">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de Categorias</CardTitle>
          <CardDescription>Todas as categorias cadastradas no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Exibição</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Nenhuma categoria encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                orderedCategorias.map((categoria) => (
                  <TableRow key={categoria.id} className={categoria.parentId ? "bg-muted/20" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {categoria.parentId && (
                          <span className="text-muted-foreground ml-2">└</span>
                        )}
                        <span className={categoria.parentId ? "text-muted-foreground ml-2" : ""}>
                          {categoria.name}
                        </span>
                        {!categoria.parentId ? (
                          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-[10px]">Principal</Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2 text-[10px]">Sub</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{categoria.slug}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {categoria.showInMainMenu && <Badge variant="secondary" className="text-[10px]">Menu</Badge>}
                        {categoria.showOnHome && <Badge variant="secondary" className="text-[10px]">Home</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{categoria._count.products}</Badge>
                    </TableCell>
                    <TableCell>
                      {categoria.isActive ? (
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">Ativa</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">Inativa</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(categoria.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <ToggleCategoryButton id={categoria.id} currentStatus={categoria.isActive} />
                        <Link href={`/admin/categorias/${categoria.id}/editar`}>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </Link>
                        {categoria._count.products === 0 && (
                          <DeleteCategoryButton id={categoria.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
