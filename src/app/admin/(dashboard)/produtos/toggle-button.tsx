"use client"

import { useTransition } from "react"
import { toggleProductActive } from "@/actions/products"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function ToggleStatusButton({ id, type, currentStatus }: { id: string, type: "active" | "featured" | "promo", currentStatus: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      title={currentStatus ? "Inativar" : "Ativar"}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          if (type === "active") {
            await toggleProductActive(id)
          }
          // outas lógicas de feature e promo podem ir aqui
        })
      }}
    >
      {currentStatus ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
      <span className="sr-only">{currentStatus ? "Inativar" : "Ativar"}</span>
    </Button>
  )
}
