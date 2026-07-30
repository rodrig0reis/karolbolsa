import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ToggleStatusButton } from "./toggle-button"
import { formatCurrency } from "@/lib/utils"

export default async function ProdutosPage() {
  const produtos = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de bolsas e acessórios.</p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem de Produtos</CardTitle>
          <CardDescription>Todos os produtos cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço (R$)</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Destaques</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                        <Image 
                          src={produto.mainImage} 
                          alt={produto.name} 
                          fill 
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {produto.name}
                    </TableCell>
                    <TableCell>{produto.category.name}</TableCell>
                    <TableCell>
                      {produto.promoPrice ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-emerald-600">{formatCurrency(produto.promoPrice)}</span>
                          <span className="text-xs text-muted-foreground line-through">{formatCurrency(produto.price)}</span>
                        </div>
                      ) : (
                        <span className="font-medium">{formatCurrency(produto.price)}</span>
                      )}
                    </TableCell>
                    <TableCell>{produto.stock}</TableCell>
                    <TableCell>
                      {produto.isActive ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {produto.isFeatured && <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Destaque</Badge>}
                        {produto.promoPrice && <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-300">Promo</Badge>}
                        {!produto.isFeatured && !produto.promoPrice && <span className="text-muted-foreground text-xs">-</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <ToggleStatusButton id={produto.id} type="active" currentStatus={produto.isActive} />
                        <Link href={`/admin/produtos/${produto.id}/editar`}>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </Link>
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
