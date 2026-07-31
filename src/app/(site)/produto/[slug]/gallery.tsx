"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function ProductGallery({ 
  mainImage, 
  additionalImages,
  altText
}: { 
  mainImage: string
  additionalImages: { id: string, url: string }[]
  altText: string
}) {
  const [activeImage, setActiveImage] = useState(mainImage)

  const allImages = [mainImage, ...additionalImages.map(img => img.url)]

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem Principal */}
      <div className="flex overflow-x-auto md:block snap-x snap-mandatory w-full scrollbar-hide">
        {/* Mobile: Mostra todas as imagens com swipe */}
        <div className="md:hidden flex w-full">
          {allImages.map((img, idx) => (
            <div 
              key={idx} 
              id={`img-mobile-${idx}`} 
              className="relative aspect-[4/5] w-full flex-shrink-0 snap-center overflow-hidden rounded-2xl bg-muted"
            >
              <Image
                src={img}
                alt={`${altText} - Imagem ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Desktop: Mostra apenas a imagem ativa */}
        <div className="hidden md:block relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={activeImage}
            alt={altText}
            fill
            priority
            sizes="50vw"
            className="object-cover transition-all duration-300"
          />
        </div>
      </div>

      {/* Miniaturas */}
      {allImages.length > 1 && (
        <div className="flex gap-4 overflow-auto pb-2 scrollbar-hide">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveImage(img)
                const el = document.getElementById(`img-mobile-${idx}`)
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                }
              }}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                activeImage === img ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`Miniatura ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
