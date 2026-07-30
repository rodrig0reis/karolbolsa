"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number | string | unknown
  promoPrice?: number | string | unknown | null
  mainImage: string
  isPromo: boolean
  isAvailable: boolean
  isActive: boolean
  categoryName: string
  whatsappUrl?: string
}

export function ProductCard({
  name,
  slug,
  price,
  promoPrice,
  mainImage,
  isPromo,
  isAvailable,
  isActive,
  categoryName,
  whatsappUrl
}: ProductCardProps) {
  // Se estiver inativo, não deve renderizar (fallback de segurança)
  if (!isActive) return null

  return (
    <Card className="group flex flex-col h-full overflow-hidden border-border/50 bg-background hover:border-primary/30 transition-colors shadow-sm hover:shadow-md relative">
      <Link href={`/produto/${slug}`} className="flex-1 flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {/* Etiquetas e Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {!isAvailable && (
              <Badge className="bg-zinc-800 hover:bg-zinc-900 text-white shadow-sm border-none">
                Esgotado
              </Badge>
            )}
            {isPromo && isAvailable && (
              <Badge className="bg-rose-500 hover:bg-rose-600 text-white shadow-sm border-none">
                Promoção
              </Badge>
            )}
          </div>

          <Image
            src={mainImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? "grayscale opacity-80" : ""}`}
          />
        </div>
        <CardContent className="p-5">
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider line-clamp-1">{categoryName}</div>
          <h3 className="font-medium text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="flex items-baseline gap-2 mt-3">
            {promoPrice && isPromo ? (
              <>
                <span className="text-lg font-bold text-primary">{formatCurrency(promoPrice)}</span>
                <span className="text-sm text-muted-foreground line-through">{formatCurrency(price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">{formatCurrency(price)}</span>
            )}
          </div>
        </CardContent>
      </Link>
      <div className="p-5 pt-0 mt-auto flex flex-col gap-2">
        <Link href={`/produto/${slug}`} className="w-full">
          <Badge variant="outline" className="w-full justify-center py-2 hover:bg-muted cursor-pointer rounded-md">
            Ver detalhes
          </Badge>
        </Link>
        {isAvailable && whatsappUrl && (
          <Link href={whatsappUrl} target="_blank" className="w-full" onClick={(e) => e.stopPropagation()}>
            <Badge className="w-full justify-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-md border-none">
              Comprar pelo WhatsApp
            </Badge>
          </Link>
        )}
      </div>
    </Card>
  )
}
