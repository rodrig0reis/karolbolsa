"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteCategory } from "@/actions/categories"
import { useTransition } from "react"

export function DeleteCategoryButton({ id, productCount }: { id: string, productCount: number }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (productCount > 0) {
      alert(`Não é possível deletar esta categoria pois ela possui ${productCount} produtos atrelados.`)
      return
    }

    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      startTransition(async () => {
        const res = await deleteCategory(id)
        if (res?.error) {
          alert(res.error)
        }
      })
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={isPending || productCount > 0}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      title={productCount > 0 ? "Categoria possui produtos" : "Deletar categoria"}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
