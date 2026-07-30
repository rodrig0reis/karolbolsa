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
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
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
                <TableHead>Ordem</TableHead>
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
                categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell className="font-medium">{categoria.name}</TableCell>
                    <TableCell>{categoria.slug}</TableCell>
                    <TableCell>{categoria.order}</TableCell>
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
