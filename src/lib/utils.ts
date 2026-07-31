import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string | null | undefined | unknown): string {
  if (value == null) return "R$ 0,00"
  
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
  
  if (isNaN(numValue)) return "R$ 0,00"
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

export function formatPhoneBR(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    // 55 65 99228 1830 -> (65) 99228-1830
    return `(${cleaned.substring(2, 4)}) ${cleaned.substring(4, 9)}-${cleaned.substring(9)}`
  }
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`
  }
  return phone
}

export function buildGeneralWhatsAppUrl(phone: string): string {
  const text = "Olá, vim pelo site da Karol Bolsas e gostaria de atendimento."
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export function buildProductWhatsAppUrl(phone: string, productName: string, price: unknown): string {
  const formattedPrice = formatCurrency(price)
  const text = `Olá, vi este produto no site da Karol Bolsas e tenho interesse: ${productName} - Valor: ${formattedPrice}. Pode me passar mais informações?`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
