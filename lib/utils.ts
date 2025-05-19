import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Fonction utilitaire pour combiner et fusionner les classes Tailwind.
// Pratique pour gérer les classes conditionnelles proprement.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}