"use client"

import { useState, useRef } from "react"
import { Image as ImageIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadPreviewProps {
  name?: string
  defaultValue?: string
  label?: string
}

export function ImageUploadPreview({ name = "image", defaultValue, label = "Imagem" }: ImageUploadPreviewProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      if (!defaultValue) setPreview(null)
      return
    }

    // Validação básica (opcional para o MVP, apenas UI feedback)
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido.")
      e.target.value = ""
      return
    }

    // Criar preview local
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    
    // Opcional: revogar o url anterior se estivesse gerido localmente, 
    // mas para simplificar vamos apenas renderizar.
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium leading-none">{label}</span>
      <div className="relative mt-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 flex flex-col items-center justify-center bg-muted/10 transition-colors hover:bg-muted/20">
        
        {preview ? (
          <div className="relative w-full aspect-video md:aspect-[3/1] max-w-2xl overflow-hidden rounded-md border bg-muted">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90 shadow-sm hover:opacity-100"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
              <ImageIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Selecione uma imagem
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <input
            type="file"
            name={name}
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${name}`}
          />
          <Button 
            type="button" 
            variant="secondary" 
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Procurar arquivo...
          </Button>
        </div>
      </div>
      
      {/* Se o usuário remover o preview de um default, precisamos enviar um campo hidden vazio pra indicar deleção ou forçar required se o schema demandar */}
      {!preview && defaultValue && (
        <input type="hidden" name={`${name}Removed`} value="true" />
      )}
    </div>
  )
}
