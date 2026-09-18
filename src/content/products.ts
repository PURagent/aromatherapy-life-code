export type ShopProduct = {
  sku: string
  name: string
  subtitle: string
  collection: string
  size: string
  priceTHB: number
  accent: string
  glow: string
}

/**
 * Prototype shop metadata. Prices are intentionally marked as demo values in the UI
 * until the owner confirms the final catalogue and payment setup.
 */
export const shopProducts: ShopProduct[] = [
  { sku: 'NO-1', name: 'ซีทรัส สดชื่น', subtitle: 'โทนซิตรัส · โปร่งเบา', collection: 'The Nine', size: '10 ml', priceTHB: 490, accent: '#f2c879', glow: '#e9a341' },
  { sku: 'NO-2', name: 'ลาเวนเดอร์', subtitle: 'โทนดอกไม้ · นุ่มลึก', collection: 'The Nine', size: '10 ml', priceTHB: 520, accent: '#b69de8', glow: '#8b69d5' },
  { sku: 'NO-3', name: 'ดอกปีบ', subtitle: 'โทนขาวสะอาด · ละมุน', collection: 'The Nine', size: '10 ml', priceTHB: 520, accent: '#d8e7d0', glow: '#83b68b' },
  { sku: 'NO-4', name: 'ดอกไม้หอม', subtitle: 'โทน floral · สว่างอุ่น', collection: 'The Nine', size: '10 ml', priceTHB: 540, accent: '#f0b4ca', glow: '#d26e98' },
  { sku: 'NO-5', name: 'แท่งไม้และกฤษณา', subtitle: 'โทนไม้ · ควันบาง', collection: 'The Nine', size: '10 ml', priceTHB: 590, accent: '#d3a16c', glow: '#a36534' },
  { sku: 'NO-6', name: 'ดอกไม้สีขาว', subtitle: 'โทน white floral · สงบ', collection: 'The Nine', size: '10 ml', priceTHB: 520, accent: '#e7e6d1', glow: '#b7c18b' },
  { sku: 'NO-7', name: 'มะลิป่า', subtitle: 'โทน jasmine · เขียวสด', collection: 'The Nine', size: '10 ml', priceTHB: 540, accent: '#c7d98c', glow: '#769d4e' },
  { sku: 'NO-8', name: 'ดอกแก้ว', subtitle: 'โทนดอกไม้ · ใสสะอาด', collection: 'The Nine', size: '10 ml', priceTHB: 520, accent: '#d6c4f0', glow: '#9d78d2' },
  { sku: 'NO-9', name: 'ดอกบัว', subtitle: 'โทน aquatic floral · นวล', collection: 'The Nine', size: '10 ml', priceTHB: 560, accent: '#d8a9bd', glow: '#9e5c88' },
]

