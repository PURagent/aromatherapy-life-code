import { useEffect, useRef } from 'react'
import { shopProducts } from '../content/products'
import { Icon, BrandMark } from '../components/Visuals'
import { DEMO_QUANTITY_LIMIT } from './cart'
import { useShop } from './useShop'
import { BottleVisual } from './ProductVisual'
import './shop.css'

export function ShopDrawer() {
  const { items, count, isOpen, closeCart, removeItem, setQuantity } = useShop()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
      if (previousFocus.current?.isConnected) previousFocus.current.focus()
    }
  }, [isOpen])
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])
  const selected = items.map((item) => ({ item, product: shopProducts.find((product) => product.sku === item.sku) })).filter((entry) => entry.product)
  return <dialog className="cart-dialog" ref={dialogRef} aria-labelledby="cart-dialog-title" aria-describedby="cart-dialog-description" onCancel={closeCart} onClose={closeCart} onClick={(event) => { if (event.target === event.currentTarget) closeCart() }}>
    <div className="cart-dialog-inner">
      <header className="cart-dialog-header"><div><p className="eyebrow">YOUR AROMA EDIT</p><h2 id="cart-dialog-title">ตะกร้าของคุณ <span>{count}</span></h2></div><button className="icon-button" type="button" onClick={closeCart} aria-label="ปิดตะกร้า" autoFocus><Icon name="close" /></button></header>
      <p className="cart-dialog-notice" id="cart-dialog-description"><span className="status-dot" aria-hidden="true" />เป็นตะกร้าตัวอย่าง รอข้อมูลสินค้าและราคา</p>
      <div className="cart-dialog-items" aria-live="polite" aria-atomic="false">
        {selected.length === 0 ? <div className="cart-dialog-empty"><div><BrandMark /></div><h3>พื้นที่สำหรับกลิ่นที่ชอบ</h3><p>เลือกกลิ่นจากคอลเลกชัน แล้วเก็บไว้ที่นี่เพื่อจัดชุดของคุณ</p><button type="button" className="button primary" onClick={closeCart}>เลือกดูกลิ่น <Icon name="arrow" /></button></div> : selected.map(({ item, product }) => product && <article className="cart-dialog-item" key={item.sku}>
          <div className="cart-dialog-thumb"><BottleVisual index={shopProducts.findIndex((entry) => entry.sku === product.sku)} small /></div>
          <div className="cart-dialog-item-detail"><p className="product-sku">{product.sku}</p><h3>{product.name}</h3><p className="cart-dialog-price">รอยืนยันราคา</p>
            <div className="cart-dialog-item-actions"><div className="cart-quantity" role="group" aria-label={`จำนวน ${product.name}`}><button type="button" aria-label={`ลดจำนวน ${product.name}`} disabled={item.quantity <= 1} onClick={() => setQuantity(item.sku, item.quantity - 1)}><Icon name="minus" /></button><span aria-label={`${item.quantity} ชิ้น`}>{item.quantity}</span><button type="button" aria-label={`เพิ่มจำนวน ${product.name}`} disabled={item.quantity >= DEMO_QUANTITY_LIMIT} onClick={() => setQuantity(item.sku, item.quantity + 1)}><Icon name="plus" /></button></div><button type="button" className="cart-remove" onClick={() => removeItem(item.sku)}>นำออก</button></div>
          </div>
        </article>)}
      </div>
      {selected.length > 0 && <footer className="cart-dialog-footer"><div className="cart-dialog-subtotal"><span>รวม {count} ชิ้น</span><strong>รอยืนยันราคา</strong></div><p className="cart-dialog-disclaimer">จำนวน 1–{DEMO_QUANTITY_LIMIT} ชิ้นต่อกลิ่นเป็นขอบเขตสำหรับทดลองใช้งาน ไม่ใช่ข้อมูลสต็อกจริง</p><button className="button primary cart-checkout" type="button" disabled>ชำระเงิน <Icon name="arrow" /></button><p className="cart-checkout-reason">รอราคาและการเชื่อมระบบชำระเงิน</p><button type="button" className="cart-continue" onClick={closeCart}>เลือกดูกลิ่นต่อ</button><p className="cart-memory-note">ตะกร้าตัวอย่างจะเริ่มใหม่เมื่อรีเฟรชหน้า</p></footer>}
    </div>
  </dialog>
}
