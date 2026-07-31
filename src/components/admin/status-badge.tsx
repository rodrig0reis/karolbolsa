import { cn } from "@/lib/utils"

type StatusVariant = "active" | "inactive" | "out-of-stock" | "promo" | "featured" | "draft" | "default"

interface StatusBadgeProps {
  status: StatusVariant
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  let defaultLabel = ""
  let colorClass = ""

  switch (status) {
    case "active":
      defaultLabel = "Ativo"
      colorClass = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
      break
    case "inactive":
      defaultLabel = "Inativo"
      colorClass = "bg-muted text-muted-foreground"
      break
    case "out-of-stock":
      defaultLabel = "Esgotado"
      colorClass = "bg-destructive/15 text-destructive"
      break
    case "promo":
      defaultLabel = "Promoção"
      colorClass = "bg-amber-500/15 text-amber-700 dark:text-amber-400"
      break
    case "featured":
      defaultLabel = "Destaque"
      colorClass = "bg-blue-500/15 text-blue-700 dark:text-blue-400"
      break
    case "draft":
      defaultLabel = "Rascunho"
      colorClass = "bg-orange-500/15 text-orange-700 dark:text-orange-400"
      break
    default:
      defaultLabel = "Desconhecido"
      colorClass = "bg-secondary text-secondary-foreground"
  }

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", colorClass, className)}>
      {label || defaultLabel}
    </span>
  )
}
