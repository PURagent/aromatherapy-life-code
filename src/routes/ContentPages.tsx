import { useState } from 'react'
import { LocalLink, type Navigate } from '../App'
import { AromaWheel, BrandMark, Icon } from '../components/Visuals'
import { getCataloguePreview, publicContent } from '../lib/content'
import site from '../content/site.json'

type PageProps = { navigate: Navigate }

export function CataloguePage({ navigate }: PageProps) {
  const [query, setQuery] = useState('')
  const preview = import.meta.env.DEV ? getCataloguePreview() : null
  const scents = (preview ? preview.scents : publicContent.scents).filter((scent) => scent.kind === 'number')
  const search = query.trim().toLocaleLowerCase('th')
  const visibleScents = scents.filter((scent) => `${scent.botanicalNameTh} ${scent.sku}`.toLocaleLowerCase('th').includes(search))

  return (
    <section className="catalogue-page">
      <LocalLink to="/" navigate={navigate} className="back-link"><Icon name="back" /> กลับหน้าหลัก</LocalLink>
      <header className="page-heading">
        <div><h1>โลกของกลิ่น</h1><p>เริ่มจากชื่อที่คุณสนใจ แล้วค่อย ๆ ค้นพบความชอบของตัวเอง</p></div>
        <AromaWheel compact />
      </header>

      {preview && (
        <div className="prototype-note" role="note">
          <span className="status-dot" aria-hidden="true" />
          <div><strong>{preview.labelTh}</strong><p>รายการนี้เป็นตัวอย่างสำหรับตรวจต้นแบบ ยังไม่ได้คัดเลือกหรือแนะนำให้คุณเป็นการส่วนตัว</p></div>
        </div>
      )}

      {scents.length > 0 ? (
        <>
          <div className="catalogue-toolbar">
            <label htmlFor="scent-search">ค้นหาชื่อกลิ่น</label>
            <input id="scent-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="พิมพ์ชื่อกลิ่นที่สนใจ" maxLength={120} autoComplete="off" />
            {query && <button className="text-link" type="button" onClick={() => setQuery('')}>ล้างคำค้น</button>}
            <p role="status" aria-live="polite">{visibleScents.length} รายการ</p>
          </div>
          {visibleScents.length > 0 ? (
            <div className="scent-grid">
              {visibleScents.map((scent) => (
                <article className="scent-item" key={scent.sku}>
                  <div className="scent-symbol" aria-hidden="true"><BrandMark /></div>
                  <div>
                  <p className="scent-sku">{scent.sku}</p>
                  <h2>{scent.botanicalNameTh}</h2>
                  <p>{preview ? 'ชื่อกลิ่นจากบรีฟ · รอยืนยัน' : 'ชื่อกลิ่นในคอลเลกชัน'}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="inline-empty" role="status">
              <Icon name="leaf" />
              <h2>ยังไม่พบชื่อกลิ่นนี้</h2>
              <p>ลองใช้คำสั้น ๆ หรือกลับไปดูรายการทั้งหมด</p>
              <button className="button secondary" type="button" onClick={() => setQuery('')}>ดูทุกกลิ่น</button>
            </div>
          )}
        </>
      ) : (
        <section className="catalogue-empty">
          <BrandMark />
          <h2>คอลเลกชันกำลังเตรียมพร้อม</h2>
          <p>เรากำลังรอเจ้าของแบรนด์ยืนยันชื่อและรายละเอียดสินค้า เพื่อให้คุณได้อ่านข้อมูลที่ตรวจสอบแล้ว</p>
          <LocalLink to="/" navigate={navigate} className="button secondary">กลับหน้าหลัก <Icon name="arrow" /></LocalLink>
        </section>
      )}

      <details className="catalogue-contact">
        <summary>รายละเอียดการสั่งซื้อ</summary>
        <p>{site.purchasePending} ต้นแบบนี้จึงยังไม่มีปุ่มสั่งซื้อ</p>
      </details>
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
