"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Copy, Search, Plus, Filter, LayoutGrid, List } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/admin/status-badge"
import { formatCurrency } from "@/lib/utils"

export function ProductListClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter
      
      let matchesStatus = true
      if (statusFilter === "active") matchesStatus = p.isActive && p.stock > 0
      if (statusFilter === "inactive") matchesStatus = !p.isActive
      if (statusFilter === "out_of_stock") matchesStatus = p.stock === 0
      if (statusFilter === "promo") matchesStatus = !!p.promoPrice
      if (statusFilter === "featured") matchesStatus = p.isFeatured

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [initialProducts, search, categoryFilter, statusFilter])

  // Duplicação client-side visual para demonstração (MVP)
  // Num projeto real, deve chamar Server Action
  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    alert(`A funcionalidade de duplicar será ativada via Server Action para o produto ${id}.`)
  }

  return (
    <div className="space-y-4">
      {/* Barra de Ferramentas / Filtros */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-card p-4 rounded-xl border">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome ou SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "all")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativos em Estoque</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="out_of_stock">Esgotados</SelectItem>
              <SelectItem value="promo">Em Promoção</SelectItem>
              <SelectItem value="featured">Em Destaque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex border rounded-md p-1 bg-muted/20">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/admin/produtos/novo" className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Link>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
      </div>

      {/* Grid de Cards Responsivos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-xl">
          <Search className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="font-medium text-lg">Nenhum produto encontrado</p>
          <p className="text-muted-foreground">Tente limpar os filtros ou buscar por outro termo.</p>
        </div>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "flex flex-col gap-3"
        }>
          {filteredProducts.map(produto => (
            <div 
              key={produto.id} 
              className={`bg-card border rounded-xl overflow-hidden hover:shadow-md transition-shadow flex ${viewMode === "grid" ? "flex-col" : "flex-row items-center p-3"}`}
            >
              <div className={`relative bg-muted ${viewMode === "grid" ? "w-full aspect-square" : "w-20 h-20 rounded-md flex-shrink-0"}`}>
                <Image 
                  src={produto.mainImage || "/placeholder.jpg"} 
                  alt={produto.name} 
                  fill 
                  className="object-cover"
                />
                {viewMode === "grid" && (
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <StatusBadge status={!produto.isActive ? "inactive" : produto.stock === 0 ? "out-of-stock" : "active"} />
                    {produto.isFeatured && <StatusBadge status="featured" />}
                  </div>
                )}
              </div>
              
              <div className={`p-4 flex-1 flex flex-col ${viewMode === "list" && "py-1"}`}>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-2 leading-tight">{produto.name}</h3>
                    {viewMode === "list" && (
                       <StatusBadge status={!produto.isActive ? "inactive" : produto.stock === 0 ? "out-of-stock" : "active"} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    {produto.category?.name} {produto.sku ? `• SKU: ${produto.sku}` : ''}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      {produto.promoPrice ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-emerald-600">{formatCurrency(produto.promoPrice)}</span>
                          <span className="text-xs text-muted-foreground line-through">{formatCurrency(produto.price)}</span>
                        </div>
                      ) : (
                        <span className="font-bold">{formatCurrency(produto.price)}</span>
                      )}
                    </div>
                    <div className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                      Estoque: {produto.stock}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
                  <Link href={`/admin/produtos/${produto.id}/editar`} className={cn(buttonVariants({ variant: "default", size: "sm" }), "flex-1 h-9")}>Editar</Link>
                  <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={(e) => handleDuplicate(e, produto.id)} title="Duplicar">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <a href={`/produto/${produto.slug}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-9 w-9 shrink-0")} title="Ver no site">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
