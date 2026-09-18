# ส่งมอบต้นแบบ The Celestial Sanctuary — 9 กันยายน 2026

เวอร์ชัน app-3d เปลี่ยนจาก ivory ที่เจ้าของงานปฏิเสธเป็นโลกแฟนตาซีตามโปสเตอร์: ม่วงดำ ทอง วง sacred geometry ขวดแก้ว และแท่นทอง มีฉาก Three.js จริงและภาพ Higgsfield พร้อมฟอร์มเดิม **ยังไม่ได้เผยแพร่ และยังไม่ใช่ระบบคำนวณรหัสพร้อมเปิดใช้**

## สิ่งที่อยู่ในเวอร์ชันนี้

| ส่วน | ผลลัพธ์ |
|---|---|
| หน้าแรก | Aromatherapy Life Code, mandala และขวด concept สามใบ, mood สามแบบ, drag, pointer light, scroll dolly, ปลุกประกาย, หยุดภาพ และทางเข้าฟอร์ม /#begin |
| งานภาพ | Higgsfield fantasy sanctuary ในกรอบโค้ง พร้อม caption ว่าเป็นภาพศิลปะแนวคิด |
| ขั้นตอนใช้งาน | ฟอร์ม พ.ศ./ค.ศ., เวลา optional, ตรวจวันที่, ผลรอยืนยันสูตร, ล้างข้อมูล และดาวน์โหลดภาพสถานะ |
| เนื้อหา | คลังกลิ่น preview ใน dev, production empty state เมื่อไม่มี confirmed content, เลขอ้างอิงและความเป็นส่วนตัว |
| เทคโนโลยี | Vite + React + strict TypeScript + Tailwind CSS v4 + Three.js; static SPA ไม่มี backend |
| Figma | หน้า 18:8 เป็น ivory เดิมที่ถูกแทนที่แล้ว หน้าแฟนตาซีใหม่อยู่ระหว่างจัดทำและรอลิงก์ที่ตรวจยืนยัน |

## งานภาพและที่มา

[direction.md](docs/fantasy/direction.md) คือ authority contract จากโปสเตอร์ image1–image4 และคำสั่งเปลี่ยนโลกภาพของเจ้าของงาน มี direction seed 0eccc689 (index 6) แต่ธีมโปสเตอร์ที่เจ้าของระบุเป็น authority สูงกว่า นี่เป็น code-led reconstruction ไม่มี independently approved UI comp หรือ QUALITY BAR card ผล detector ทั้ง 184 advisories เทียบกับ DESIGN ivory เดิม จึงเก็บเป็นหลักฐานย้อนหลัง

ภาพ public/images/celestial-sanctuary.webp ขนาด 2200 × 1228, 311,498 bytes มาจาก Higgsfield job f863ef61-bc37-4b74-b7da-49c3b1bc117b โดยอัปโหลดโปสเตอร์เป็น style reference จริง Requested model คือ nano_banana_pro แต่ provider รายงาน nano_banana_2 ดู [provenance](docs/fantasy/higgsfield-provenance.json) ภาพนี้เป็น fantasy concept ไม่ใช่ภาพสินค้าจริงหรือผลสุขภาพ

ฉาก src/scene/ เป็น WebGL ของ Three.js ที่มี geometry และ procedural texture สร้างในโค้ด: วง mandala, lotus เจ็ดสี, วงเลข 1–9 ตกแต่ง, ขวด concept สามใบ, แท่นทอง/obsidian, vapor และดาว ฉากไม่ได้รับชื่อหรือวันเกิดของผู้กรอก วัสดุแก้วเป็นการประมาณภายใต้ renderer ที่จำกัด ไม่ใช่การจำลองการหักเหทางกายภาพเต็มรูปแบบ ดูการดัดแปลง lifecycle/renderer จาก ThreeUI Community ใน [THREEUI-SOURCES.md](docs/THREEUI-SOURCES.md) และ [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

## พฤติกรรม motion ใน source

- โหลดฉากแยกผ่าน React.lazy; palette สามแบบเปลี่ยนแสงและสีขวดกลาง โดยไม่คำนวณผลส่วนบุคคล
- Horizontal drag หมุนฉากภายในขอบเขตและเก็บ vertical touch scroll; pointer เปลี่ยนแสง/มุมมอง; scroll ทำ camera dolly
- ปลุกประกาย reset orbit และขยายอนุภาคอย่างนุ่มนวล ปุ่มนี้ disabled เมื่อ pause หรือ reduced motion
- Pause และ reduced motion หยุด continuous WebGL motion และ CSS animation; mood ยังเลือกได้ด้วย static redraw
- IntersectionObserver และ Page Visibility หยุด loop เมื่อนอกจอหรือแท็บซ่อน; กลับมามองเห็นจึงเริ่มต่อ
- จำกัด DPR 1.5, backing-buffer 650,000 pixels และการ schedule animation 30 fps เป็น source limits ไม่ใช่ผลวัดจริง
- WebGL failure/context loss แสดงภาพ local fallback; restoration สร้าง renderer ใหม่ และ cleanup dispose ทรัพยากรเมื่อออกจากหน้า

## สูตรและข้อมูลที่ยังรอ

ผู้ใช้แจ้งว่า “ยืนยันแล้ว จะส่งกติกาและตัวอย่างให้” แต่ยังไม่มีรายละเอียดหรือตัวอย่างผลในงานนี้ จึงไม่ตอบ Q1–Q9 แทนเจ้าของงาน และไม่คาดเดาวิธีลดเลข บทบาทชื่อ/เวลา รูปแบบรหัส ตารางกลิ่น หรือจักระของสูตรพิเศษ `src/engine/` ยังเป็น pending implementation ที่ไม่มีเลขหรือคำแนะนำส่วนบุคคล และ fixtures ยังเป็น `[]`

เมื่อได้รับข้อมูล ให้ทำตามลำดับ:

1. บันทึกคำตอบจริงและแหล่งยืนยันใน `../_plan/00-requirements.md` ส่วน Q1–Q9 พร้อมกติกาฉบับที่ใช้
2. เพิ่มกรณี input → expected output ที่หมอเน่ยืนยันใน `src/content/engine-fixtures.json` ใช้ข้อมูลตัวอย่างที่อนุญาตเท่านั้น
3. เพิ่ม result variant ใน `src/engine/types.ts` ตามรูปแบบที่ยืนยัน แล้วเขียน pure implementation ใน `src/engine/` อย่าใช้ fixture lookup เป็นเครื่องคำนวณทั่วไป
4. ทดสอบกับทุก fixture และกรณีขอบเขตที่กติกากำหนด ก่อนเปลี่ยน export จาก pending engine ใน `src/engine/index.ts`
5. ยืนยันเนื้อหาเป็นรายรายการด้วย `ownerConfirmation.confirmedBy` และ `reference` พร้อมแก้ข้อขัดแย้งก่อนเปลี่ยน `status` เป็น `confirmed`
6. ต่อผลสูตรกับ UI และข้อความที่ยืนยันแล้ว โดยคงข้อห้ามเรื่องเปอร์เซ็นต์ คะแนน ระดับ แถบหรือเกจสุขภาพ/จักระ และตรวจซ้ำก่อนเปิดใช้

ข้อมูลดิบ 34 รายการยัง pending ทั้งหมด ตัวคัดเลือกข้อมูลสาธารณะส่งเฉพาะ SKU, ชนิด และชื่อพฤกษศาสตร์ของรายการที่ยืนยัน การอนุมัติชื่อกลิ่นไม่ได้เผยแพร่ข้อความสุขภาพหรือการจับคู่กลิ่นจาก JSON โดยอัตโนมัติ ใน dev มีตัวอย่างชื่อกลิ่น 9 รายการติดป้ายรอยืนยัน ส่วน production ยังไม่มีรายการ confirmed จึงแสดง empty state

**ยังไม่ได้ทดสอบความถูกต้องของสูตร** เทสต์ engine 9 กรณีพิสูจน์เพียงสัญญา pending, การไม่สร้างผลส่วนบุคคล และการไม่แก้ input เท่านั้น

## ข้อมูลส่วนบุคคล

ฟอร์มและผลอยู่ใน React memory ใช้ History API เฉพาะ path/hash และ state `null` ไม่บันทึกชื่อ วันเกิด หรือเวลาเกิดใน URL, storage หรือ cookie การ reset และ reload ล้างข้อมูลแอป ไม่มี analytics หรือ API สำหรับเก็บ lead แบบอักษรโหลดจากเว็บเดียวกัน ชื่อผู้กรอกใช้ JSX interpolation และภาพสถานะ 1080 × 1920 สร้างด้วย Canvas ใน browser โดยไม่รับข้อมูลส่วนตัวเป็น argument

ช่องทางขาย ราคา และ LINE/shop URL ยังรอข้อมูลจริง ไม่มีราคาหรือลิงก์ซื้อที่สมมติขึ้น และไม่มีการสร้างฐานข้อมูล

## ผลตรวจของ app-3d

ผลตรวจ root หลังปรับวัสดุรอบสุดท้ายผ่าน 43 tests / 4 files, lint และ build รวม content validation / artifact checks แล้ว Initial JS/CSS ตาม manifest 79.5 KB gzip และรวม chunk 225.9 KB gzip ผ่าน budgets ที่กำหนด ตัวเลขไม่รวมภาพและ fonts และ initial manifest ไม่ใช่ยอดดาวน์โหลดหน้าแรกทั้งหมด เพราะฉาก 3D โหลดเพิ่มหลัง entry bundle

ไม่มีผล Lighthouse หรือการวัด FPS บนอุปกรณ์จริง ตัวเลข render cap ไม่รับรองประสิทธิภาพ และ interface tests ไม่ยืนยันความถูกต้องของสูตร ดูหลักฐานตรวจภาพรอบแฟนตาซีใน docs/fantasy และ .impeccable/review ตามที่บันทึกจริง

## ทดลองและรับช่วงต่อ

ใช้คำสั่งใน [README.md](README.md) เปิด dev ที่ [localhost:5187](http://127.0.0.1:5187/) หรือ production preview ที่ [localhost:4187](http://127.0.0.1:4187/) ขณะ process รันอยู่ หากปิด process ให้เริ่มใหม่ตามคู่มือ ลิงก์ “แบบแรก” ในส่วนหัวเปิดต้นแบบเดิมที่ `http://127.0.0.1:5186/` ซึ่งต้องมี server ของ `../app/` รันอยู่

Cloudflare Pages ใช้ root `app-3d`, build `npm run build`, output `dist` พร้อม SPA fallback และ `public/_headers` แต่ยังไม่ได้สร้างโครงการหรือ deploy ก่อนเผยแพร่ต้องใช้ปลายทางจริงสำหรับลิงก์ต้นแบบเดิม ตรวจ header/routing บน host และสั่งเผยแพร่แยกต่างหาก การเปิดคำนวณจริงยังรอกติกา ตัวอย่าง และเนื้อหาที่เจ้าของงานยืนยัน
