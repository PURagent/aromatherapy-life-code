# Life Code — The Celestial Sanctuary

เวอร์ชัน 3 ของ Aromatherapy Life Code สำหรับหมอเน่ mornaenae กู้คืนจากไฟล์สำรองก่อนเพิ่มคอลเลกชัน ตะกร้า และรูปจากเอกสาร ใช้ Vite + React + TypeScript + Tailwind CSS v4 พร้อมฉาก Three.js ที่เคลื่อนไหวจริง และภาพศิลปะแนวคิดจาก Higgsfield

**สถานะ: ทดลองในเครื่องได้ ยังไม่เผยแพร่ และยังไม่เปิดคำนวณรหัสจริง** เจ้าของงานแจ้งว่าจะส่งกติกาและตัวอย่าง แต่ยังไม่มีรายละเอียดที่ใช้สร้างสูตร Engine จึงคืน “รอยืนยันสูตร” โดยไม่สร้างเลขหรือคำแนะนำส่วนบุคคล ข้อมูลฟอร์มอยู่ในหน่วยความจำของหน้าเว็บ ไม่มี backend

## รันในเครื่อง

ใช้ Node.js 22.12 ขึ้นไป แล้วรันจากโฟลเดอร์ repo นี้:

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 5187 --strictPort
```

เปิด [ต้นแบบ The Celestial Sanctuary](http://127.0.0.1:5187/) หน้ารวมเวอร์ชัน `/versions/index.html` เป็นภาพเก็บย้อนหลัง ลิงก์ไปเวอร์ชันอื่นใช้ได้เฉพาะเมื่อเปิดเซิร์ฟเวอร์ของเวอร์ชันนั้นในเครื่องด้วย

## ตรวจและดู production preview

```powershell
npm test
npm run lint
npm run build
npm run preview -- --host 127.0.0.1 --port 4187 --strictPort
```

เปิด [production preview](http://127.0.0.1:4187/) คำสั่ง `build` รวม Zod validation, strict TypeScript, Vite และการตรวจไฟล์ที่สร้างแล้ว ผลลัพธ์อยู่ใน `dist/`

## ประสบการณ์และเนื้อหา

| เส้นทาง | พฤติกรรม |
|---|---|
| `/` | Hero 3D, ภาพ Higgsfield, เรื่องราวของกลิ่น และฟอร์มที่ `/#begin` |
| `/result` | แสดงสถานะรอยืนยันสูตร; เปิดตรงหรือรีเฟรชแล้วกลับไปกรอกใหม่ได้ |
| `/scents` | ค้นชื่อกลิ่น; dev แสดงตัวอย่างติดป้ายรอยืนยัน ส่วน production แสดงเฉพาะข้อมูลที่ยืนยัน |
| `/numbers/1` ถึง `/numbers/9` | พื้นที่อ้างอิงเลขที่ยังรอเนื้อหา ไม่ใช่ผลของผู้กรอก |
| `/privacy` | อธิบายการใช้ข้อมูลตามต้นแบบ |

ฟอร์มรองรับ พ.ศ./ค.ศ. เวลาเกิดไม่บังคับ ตรวจวันที่จริง และล้างข้อมูลได้ ภาพสถานะที่ดาวน์โหลดขนาด 1080 × 1920 ไม่มีชื่อ วันเกิด เวลาเกิด หรือเลขผลลัพธ์

`src/engine/` คงสัญญา `LifeCodeEngine` และ pending implementation ส่วน `src/content/engine-fixtures.json` ยังเป็น `[]` ข้อมูลดิบ 34 รายการยัง pending ทั้งหมด `vite.config.ts` คัดเลือกเนื้อหาใน Node ก่อน bundle ไม่ส่งข้อมูลดิบหรือข้อความสุขภาพที่ยังไม่ยืนยันไป browser

## งานภาพและ 3D

- โลกภาพใหม่อ้างอิงโปสเตอร์เจ้าของงานโดยตรง: ม่วงดำ กรอบทอง วง mandala สีอัญมณี ตราดอกบัวเจ็ดสี ขวดแก้วสามใบ และแท่นทอง/obsidian ดู [direction.md](docs/fantasy/direction.md)
- ฉาก Three.js จริงโหลดแยกผ่าน React.lazy เลือกบรรยากาศ ม่วงจันทรา / ครามดารา / กุหลาบราตรี ลากแนวนอน ขยับ pointer เลื่อนหน้า และกด “ปลุกประกาย” เพื่อขยายอนุภาคอย่างนุ่มนวลได้ ปุ่มเหล่านี้เป็นการเลือกงานศิลปะ ไม่ใช่ผลส่วนตัว
- “หยุดภาพ” และ reduced motion หยุด continuous motion; ยังเปลี่ยนสีด้วยการวาดภาพนิ่งได้ CSS stars และ entrance animation เคารพการหยุดและ reduced motion ด้วย ฉากนอกจอหรือแท็บที่ซ่อนจะหยุด WebGL loop
- Source จำกัด DPR ไม่เกิน 1.5, backing buffer ไม่เกิน 650,000 พิกเซล และ animation ไม่เกิน 30 fps ตัวเลขเหล่านี้เป็นเพดานในโค้ด ไม่ใช่ผลวัดอุปกรณ์จริง มีภาพ fallback เมื่อ WebGL ใช้ไม่ได้
- ภาพ [celestial-sanctuary.webp](public/images/celestial-sanctuary.webp) เป็น Higgsfield concept artwork ขนาด 2200 × 1228, 311,498 bytes มีโปสเตอร์เจ้าของงานเป็น reference ที่อัปโหลดจริง ดู [provenance](docs/fantasy/higgsfield-provenance.json)
- ดูการดัดแปลง ThreeUI Community และ MIT license ใน [THREEUI-SOURCES.md](docs/THREEUI-SOURCES.md) และ [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) Geometry และ texture แฟนตาซีสร้างในโค้ด
- Figma page 18:8 เป็นงาน ivory เดิมที่ถูกแทนที่แล้ว ลิงก์หน้าแฟนตาซีใหม่รอการตรวจยืนยัน งาน Figma เป็น layout/ภาพนิ่ง ไม่รัน WebGL

ผลตรวจหลังปรับวัสดุรอบสุดท้าย: 43 tests / 4 files, lint และ build ผ่าน Initial JS/CSS 79.5 KB gzip และรวม chunk 225.9 KB gzip ไม่รวมภาพและ fonts; หน้าแรกโหลดฉากเพิ่มหลัง entry bundle ไม่ได้วัด Lighthouse หรือ FPS บนอุปกรณ์จริง ดู [HANDOFF.md](HANDOFF.md)

## Cloudflare Pages ภายหลัง

แอปเป็น static SPA ที่เตรียมไว้สำหรับ Cloudflare Pages ยังไม่ได้สร้างโครงการหรือ deploy การตั้งค่าสำหรับรอบเผยแพร่: root `app-3d`, build command `npm run build`, output `dist` หากใช้ root เป็น Jobjab ให้ใช้ `npm --prefix app-3d ci && npm --prefix app-3d run build` และ output `app-3d/dist`

ใช้ SPA fallback ของ Pages โดยไม่สร้าง top-level `404.html` ไฟล์ `public/_headers` เตรียม CSP และ security headers; Vite preview ไม่ได้จำลอง headers เหล่านี้ ก่อนเผยแพร่ต้องปรับลิงก์ “แบบแรก” จาก localhost เป็นปลายทางจริงที่ยืนยันแล้ว
