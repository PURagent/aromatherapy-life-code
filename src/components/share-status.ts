import site from '../content/site.json'

const sans = '"Noto Sans Thai Variable", sans-serif'
const serif = '"Cormorant Garamond Variable", Georgia, serif'

/** Export a static pending-status card. Never accepts form data or an engine result. */
export async function downloadPendingCard(): Promise<void> {
  await document.fonts.ready
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const context = canvas.getContext('2d')
  if (!context) throw new Error('เบราว์เซอร์นี้ยังไม่รองรับการสร้างภาพ กรุณาลองอีกครั้งในเบราว์เซอร์อื่น')

  context.fillStyle = '#090611'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const light = context.createRadialGradient(540, 660, 0, 540, 660, 730)
  light.addColorStop(0, '#322046')
  light.addColorStop(1, '#090611')
  context.fillStyle = light
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = '#bc965d'
  context.lineWidth = 1
  context.strokeRect(42, 42, 996, 1836)

  context.save()
  context.translate(540, 720)
  context.strokeStyle = '#bc965d'
  context.lineWidth = 1.2
  for (const radius of [112, 224, 282]) {
    context.beginPath()
    context.arc(0, 0, radius, 0, Math.PI * 2)
    context.stroke()
  }
  for (let petal = 0; petal < 12; petal += 1) {
    context.save()
    context.rotate((petal * Math.PI) / 6)
    context.beginPath()
    context.ellipse(0, -112, 67, 112, 0, 0, Math.PI * 2)
    context.stroke()
    context.restore()
  }
  context.fillStyle = '#e5c994'
  context.beginPath()
  context.arc(0, 0, 5, 0, Math.PI * 2)
  context.fill()
  context.restore()

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#f1e6f5'
  context.font = `500 22px ${sans}`
  context.fillText('AROMATHERAPY LIFE CODE', 540, 162)
  context.font = `400 108px ${serif}`
  context.fillText('Life Code', 540, 300)
  context.fillStyle = '#e5c994'
  context.font = `400 27px ${sans}`
  context.fillText('ช่วงเวลาเล็ก ๆ ที่ได้กลับมารู้จักตัวเอง', 540, 378)

  context.fillStyle = '#e5c994'
  context.font = `500 57px ${sans}`
  context.fillText('รอการยืนยันสูตร', 540, 1086)
  context.fillStyle = '#bfb1ca'
  context.font = `400 31px ${sans}`
  context.fillText('ประสบการณ์นี้กำลังเตรียมพร้อม', 540, 1184)
  context.fillText('ยังไม่มีการคำนวณหรือแปลผลเฉพาะบุคคล', 540, 1240)

  context.strokeStyle = '#bc965d'
  context.beginPath()
  context.moveTo(446, 1380)
  context.lineTo(634, 1380)
  context.stroke()
  context.fillStyle = '#e5c994'
  context.font = `400 29px ${sans}`
  context.fillText(site.practitioner, 540, 1448)

  context.fillStyle = '#bfb1ca'
  context.font = `400 23px ${sans}`
  const segments = Array.from(new Intl.Segmenter('th', { granularity: 'word' }).segment(site.disclaimer), ({ segment }) => segment)
  const lines: string[] = []
  let line = ''
  for (const segment of segments) {
    if (line && context.measureText(line + segment).width > 780) {
      lines.push(line.trim())
      line = segment
    } else {
      line += segment
    }
  }
  if (line.trim()) lines.push(line.trim())
  lines.forEach((text, index) => context.fillText(text, 540, 1640 + index * 40))
  context.fillStyle = '#bfb1ca'
  context.font = `400 19px ${sans}`
  context.fillText('ภาพสถานะต้นแบบ · ไม่มีข้อมูลส่วนตัว', 540, 1794)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('สร้างภาพไม่สำเร็จ กรุณาลองอีกครั้ง')), 'image/png')
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'aromatherapy-pending.png'
  document.body.append(anchor)
  try {
    anchor.click()
  } finally {
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}


