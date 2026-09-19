export const featureLinks = [
  { label: 'โลกของกลิ่น', path: '/#scent-story' },
  { label: 'สำรวจรหัสชีวิต', path: '/#begin' },
  { label: 'คอลเลกชันสินค้า', path: '/#collection' },
  { label: 'เรื่องราวตัวเลข', path: '/#numbers' },
  { label: 'ตะกร้าของฉัน', path: '/#cart' },
  { label: 'ความเป็นส่วนตัว', path: '/#privacy' },
]

export function featureRoute(path: string) {
  const [pathname, hash] = path.split('#')
  if (pathname === '/' || !pathname) {
    if (hash === 'collection' || hash === 'cart') return '/scents'
    if (hash === 'privacy') return '/privacy'
  }
  return pathname || '/'
}
