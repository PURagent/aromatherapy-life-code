import { useState } from 'react'
import type { ReactNode } from 'react'
import { addCartItem, updateCartQuantity } from './cart'
import { shopProducts } from '../content/products'
import { ShopContext } from './useShop'

const permittedSkus = shopProducts.map((product) => product.sku)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ sku: string; quantity: number }[]>([])
  const [isOpen, setIsOpen] = useState(false)
  return <ShopContext.Provider value={{
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (sku) => { if (permittedSkus.includes(sku)) { setItems((current) => addCartItem(current, sku, permittedSkus)); setIsOpen(true) } },
    removeItem: (sku) => setItems((current) => current.filter((item) => item.sku !== sku)),
    setQuantity: (sku, quantity) => setItems((current) => updateCartQuantity(current, sku, quantity)),
  }}>{children}</ShopContext.Provider>
}

