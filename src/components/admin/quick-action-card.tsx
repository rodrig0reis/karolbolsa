import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionCardProps {
  title: string
  description?: string
  icon: LucideIcon
  href: string
  variant?: "default" | "primary" | "secondary" | "outline"
  className?: string
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href,
  variant = "default",
  className 
}: QuickActionCardProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4 rounded-xl text-center transition-all hover:scale-[1.02] active:scale-[0.98]",
        variant === "default" && "bg-card border hover:border-primary/50 hover:shadow-sm",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "outline" && "border-2 border-dashed hover:border-primary hover:bg-primary/5",
        className
      )}
    >
      <div className={cn(
        "p-3 rounded-full",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "primary" && "bg-primary-foreground/20 text-primary-foreground",
        variant === "secondary" && "bg-background text-foreground",
        variant === "outline" && "bg-muted text-muted-foreground"
      )}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-semibold text-sm leading-tight">{title}</h3>
        {description && (
          <p className={cn(
            "text-xs mt-1",
            variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
