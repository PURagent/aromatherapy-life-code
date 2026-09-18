import { createContext, useContext } from 'react'
import type { CartItem } from './cart'

export type ShopContextValue = {
  items: CartItem[]
  count: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (sku: string) => void
  removeItem: (sku: string) => void
  setQuantity: (sku: string, quantity: number) => void
}

export const ShopContext = createContext<ShopContextValue | null>(null)

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used inside ShopProvider')
  return context
}

