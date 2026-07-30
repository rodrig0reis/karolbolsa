"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProductPermanent as deleteProduct } from "@/actions/products"
import { useTransition } from "react"

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja deletar este produto? Essa ação removerá as imagens associadas.")) {
      startTransition(async () => {
        const res = await deleteProduct(id)
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
      disabled={isPending}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      title="Deletar produto"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
