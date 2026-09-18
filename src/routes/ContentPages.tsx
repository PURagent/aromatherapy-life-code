import { useState } from 'react'
import type { CSSProperties } from 'react'
import { LocalLink, type Navigate } from '../App'
import { AromaWheel, BrandMark, Icon } from '../components/Visuals'
import { shopProducts } from '../content/products'
import { useShop } from '../shop/useShop'
import site from '../content/site.json'

type PageProps = { navigate: Navigate }

export function CataloguePage({ navigate }: PageProps) {
  const [query, setQuery] = useState('')
  const { addItem, openCart } = useShop()
  const search = query.trim().toLocaleLowerCase('th')
  const visibleProducts = shopProducts.filter((product) => `${product.name} ${product.sku} ${product.subtitle}`.toLocaleLowerCase('th').includes(search))
  const formatPrice = (price: number) => `฿${new Intl.NumberFormat('th-TH').format(price)}`

  return (
    <section className="catalogue-page">
      <LocalLink to="/" navigate={navigate} className="back-link"><Icon name="back" /> กลับหน้าหลัก</LocalLink>
      <header className="page-heading">
        <div><p className="eyebrow">THE COLLECTION · AROMA ATELIER</p><h1>เลือกกลิ่นที่อยากพากลับบ้าน</h1><p>คอลเลกชันกลิ่น 9 ตัวเลขในขวดขนาดพกพา เลือกทีละกลิ่น หรือจัดชุดของคุณเอง</p></div>
        <AromaWheel compact />
      </header>

      <div className="shop-notice" role="note"><span className="status-dot" aria-hidden="true" /><div><strong>ร้านค้าในต้นแบบ</strong><p>ราคาและการชำระเงินเป็นข้อมูลทดลองเพื่อทดสอบประสบการณ์ตะกร้า รอเจ้าของแบรนด์ยืนยันก่อนเปิดขายจริง</p></div></div>

      <div className="catalogue-toolbar shop-toolbar">
        <label htmlFor="scent-search">ค้นหาในคอลเลกชัน</label>
        <input id="scent-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="เช่น ดอกบัว หรือ NO-9" maxLength={120} autoComplete="off" />
        {query && <button className="text-link" type="button" onClick={() => setQuery('')}>ล้างคำค้น</button>}
        <p role="status" aria-live="polite">{visibleProducts.length} จาก {shopProducts.length} กลิ่น</p>
      </div>

      {visibleProducts.length > 0 ? <div className="product-grid">
        {visibleProducts.map((product) => <article className="product-card" key={product.sku} style={{ '--product-accent': product.accent, '--product-glow': product.glow } as CSSProperties}>
          <div className="product-visual"><img src="/images/celestial-sanctuary.webp" alt="" loading="lazy" /><div className="product-orbit" aria-hidden="true"><span>{product.sku.replace('NO-', '')}</span></div><div className="product-bottle" aria-hidden="true"><i /><b /></div><span className="product-collection">{product.collection}</span></div>
          <div className="product-card-copy"><div className="product-meta"><span>{product.sku}</span><span>{product.size}</span></div><h2>{product.name}</h2><p>{product.subtitle}</p><div className="product-buy"><strong>{formatPrice(product.priceTHB)}</strong><button className="button product-add" type="button" onClick={() => addItem(product.sku)}><Icon name="bag" /> เพิ่มลงตะกร้า</button></div><small>ราคาเดโมสำหรับต้นแบบ</small></div>
        </article>)}
      </div> : <div className="inline-empty" role="status"><Icon name="leaf" /><h2>ยังไม่พบกลิ่นนี้</h2><p>ลองใช้ชื่อดอกไม้หรือหมายเลขสินค้าอื่น</p><button className="button secondary" type="button" onClick={() => setQuery('')}>ดูทุกกลิ่น</button></div>}

      <div className="shop-footer-note"><BrandMark /><div><h2>สร้างคอลเลกชันของคุณเอง</h2><p>เลือกหลายกลิ่นแล้วปรับจำนวนในตะกร้าได้ทันที ระบบชำระเงินจริงจะเชื่อมต่อหลังเจ้าของแบรนด์ยืนยันช่องทาง</p></div><button className="button primary" type="button" onClick={openCart}><Icon name="bag" /> เปิดตะกร้า</button></div>
      <p className="reading-note">{site.disclaimer}</p>
      
    </section>
  )
}

export function NumberPage({ number, navigate }: PageProps & { number: number | string }) {
  const referenceNumber = /^[1-9]$/.test(String(number)) ? String(number) : null
  return (
    <section className="empty-page">
      <LocalLink to="/" navigate={navigate} className="back-link"><Icon name="back" /> กลับหน้าหลัก</LocalLink>
      <div className="reference-number" aria-hidden="true">{referenceNumber ?? '—'}</div>
      <h1>{referenceNumber ? `ความหมายของเลข ${referenceNumber}` : 'คลังความหมายตัวเลข'}</h1>
      <div className="prototype-note" role="status"><span className="status-dot" aria-hidden="true" /> รอเจ้าของแบรนด์ยืนยันเนื้อหา</div>
      <p>หน้านี้เป็นพื้นที่สำหรับเนื้อหาอ้างอิงของตัวเลข ยังไม่มีคำแปลความหมายหรือการจับคู่กลิ่นที่ผ่านการยืนยัน</p>
      <p>เลขที่เปิดดูในหน้านี้ไม่ได้เป็นผลจากข้อมูลวันเกิดของคุณ</p>
      <LocalLink to="/scents" navigate={navigate} className="button secondary">ดูคอลเลกชันกลิ่น <Icon name="arrow" /></LocalLink>
      <p className="reading-note">{site.disclaimer}</p>
    </section>
  )
}

export function PrivacyPage({ navigate }: PageProps) {
  return (
    <article className="reading-page">
      <LocalLink to="/" navigate={navigate} className="back-link"><Icon name="back" /> กลับหน้าหลัก</LocalLink>
      <div className="reading-lead">
        <Icon name="lock" />
        <h1>ข้อมูลของคุณ<br />อยู่กับคุณ</h1>
        <p>ต้นแบบ {site.name} ใช้ข้อมูลที่กรอกเพื่อทดลองขั้นตอนบนหน้านี้เท่านั้น</p>
      </div>
      <section>
        <h2>ชื่อและวันเกิดอยู่ในหน่วยความจำของหน้าเว็บ</h2>
        <p>ข้อมูลจากฟอร์มอยู่ในเบราว์เซอร์ระหว่างใช้งาน ไม่มีการส่งชื่อ วันเกิด หรือเวลาเกิดไปบันทึกบนเซิร์ฟเวอร์ คุณล้างข้อมูลได้ด้วยปุ่มล้างข้อมูล และข้อมูลในหน่วยความจำของแอปจะหมดไปเมื่อโหลดหน้าเว็บใหม่</p>
      </section>
      <section>
        <h2>ไม่มีการบันทึกข้อมูลเพื่อกลับมาใช้ภายหลัง</h2>
        <p>ต้นแบบไม่บันทึกข้อมูลฟอร์มลงคุกกี้ พื้นที่จัดเก็บถาวร หรือพื้นที่จัดเก็บของเซสชันในเบราว์เซอร์ และไม่เพิ่มชื่อ วันเกิด หรือเวลาเกิดลงในที่อยู่หน้าเว็บ</p>
      </section>
      <section>
        <h2>ไม่มีระบบติดตามพฤติกรรม</h2>
        <p>ต้นแบบไม่ได้ติดตั้งเครื่องมือวิเคราะห์การใช้งานหรือส่งเหตุการณ์การกรอกฟอร์มไปยังบริการภายนอก แบบอักษรถูกโหลดจากเว็บไซต์เดียวกัน</p>
      </section>
      <section>
        <h2>ภาพที่ดาวน์โหลดไม่มีข้อมูลส่วนตัว</h2>
        <p>ภาพสถานะที่ดาวน์โหลดเป็นภาพแจ้งว่ารอการยืนยันสูตร มีเพียงข้อความของแบรนด์ ไม่มีชื่อ วันเกิด เวลาเกิด หรือเลขผลลัพธ์ ภาพถูกสร้างในเบราว์เซอร์และบันทึกลงอุปกรณ์ตามการตั้งค่าดาวน์โหลดของคุณ</p>
      </section>
      <section>
        <h2>เมื่อบริการพร้อมใช้งานจริง</h2>
        <p>หากมีการเพิ่มระบบสมาชิก การบันทึกข้อมูล หรือช่องทางติดต่อในอนาคต ต้องปรับข้อความหน้านี้ให้ตรงกับการใช้งานก่อนเปิดระบบดังกล่าว</p>
      </section>
      <div className="reading-note"><p>{site.disclaimer}</p></div>
      <LocalLink to="/" navigate={navigate} className="button secondary">กลับไปทดลอง <Icon name="arrow" /></LocalLink>
    </article>
  )
}
