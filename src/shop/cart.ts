export type CartItem = { sku: string; quantity: number }

/** Interaction limit for the prototype, never a stock claim. */
export const DEMO_QUANTITY_LIMIT = 9

export function boundedQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1
  return Math.min(DEMO_QUANTITY_LIMIT, Math.max(1, Math.trunc(quantity)))
}

export function addCartItem(items: CartItem[], sku: string, allowedSkus: readonly string[]) {
  if (!allowedSkus.includes(sku)) return items
  if (items.some((item) => item.sku === sku)) return items.map((item) => item.sku === sku ? { ...item, quantity: boundedQuantity(item.quantity + 1) } : item)
  return [...items, { sku, quantity: 1 }]
}

export function updateCartQuantity(items: CartItem[], sku: string, quantity: number) {
  return items.map((item) => item.sku === sku ? { ...item, quantity: boundedQuantity(quantity) } : item)
}

