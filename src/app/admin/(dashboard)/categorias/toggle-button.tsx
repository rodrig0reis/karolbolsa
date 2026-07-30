"use client"

import { useTransition } from "react"
import { toggleCategoryActive } from "@/actions/categories"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function ToggleCategoryButton({ id, currentStatus }: { id: string, currentStatus: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      title={currentStatus ? "Inativar" : "Ativar"}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleCategoryActive(id)
        })
      }}
    >
      {currentStatus ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
      <span className="sr-only">{currentStatus ? "Inativar" : "Ativar"}</span>
    </Button>
  )
}
