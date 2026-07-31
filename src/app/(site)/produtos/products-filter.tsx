"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export function ProductsFilter({ categorias }: { categorias: { id: string, name: string, slug: string }[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const currentQ = searchParams.get("q") || ""
  const currentCategoria = searchParams.get("categoria") || "todas"
  const currentPromocao = searchParams.get("promocao") || "todas"
  const currentDisp = searchParams.get("disponibilidade") || "todas"
  const currentOrdem = searchParams.get("ordem") || "mais-recentes"

  const applyFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "todas") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/produtos?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    applyFilters("q", formData.get("q") as string)
  }

  return (
    <div className="bg-muted/30 p-4 rounded-lg mb-8 space-y-4">
      <div className="flex gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input 
            name="q" 
            defaultValue={currentQ} 
            placeholder="Buscar produtos..." 
            className="bg-background h-11 md:h-10"
          />
          <Button type="submit" variant="secondary" className="h-11 md:h-10">
            <Search className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Buscar</span>
          </Button>
        </form>
        <Button 
          variant="outline" 
          className="md:hidden h-11 px-3" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Filtrar produtos"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      <div className={`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isOpen ? "grid" : "hidden md:grid"}`}>
        <Select value={currentCategoria} onValueChange={(v) => applyFilters("categoria", v)}>
          <SelectTrigger className="bg-background h-11 md:h-10">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categorias.map(c => (
              <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentPromocao} onValueChange={(v) => applyFilters("promocao", v)}>
          <SelectTrigger className="bg-background h-11 md:h-10">
            <SelectValue placeholder="Promoção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Qualquer preço</SelectItem>
            <SelectItem value="true">Apenas promoções</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentDisp} onValueChange={(v) => applyFilters("disponibilidade", v)}>
          <SelectTrigger className="bg-background h-11 md:h-10">
            <SelectValue placeholder="Disponibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos</SelectItem>
            <SelectItem value="disponivel">Disponível</SelectItem>
            <SelectItem value="esgotado">Esgotado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentOrdem} onValueChange={(v) => applyFilters("ordem", v)}>
          <SelectTrigger className="bg-background h-11 md:h-10">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mais-recentes">Mais recentes</SelectItem>
            <SelectItem value="menor-preco">Menor preço</SelectItem>
            <SelectItem value="maior-preco">Maior preço</SelectItem>
            <SelectItem value="destaques">Destaques</SelectItem>
            <SelectItem value="promocoes">Promoções</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
