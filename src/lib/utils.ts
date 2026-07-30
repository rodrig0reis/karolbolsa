import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string | null | undefined | unknown): string {
  if (value === null || value === undefined) return "R$ 0,00"
  
  let numValue = 0;
  if (typeof value === 'string') {
    numValue = parseFloat(value.replace(',', '.'))
  } else if (typeof value === 'number') {
    numValue = value
  } else {
    numValue = Number(value)
  }
  
  if (isNaN(numValue)) return "R$ 0,00"
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue)
}
