import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ResultPage } from './ResultPage'
import { lifeCodeEngine } from '../engine'
import type { LifeCodeInput } from '../engine'

const base: LifeCodeInput = { name: 'สมชาย', birthDate: { year: 1987, month: 3, day: 15 }, birthTime: null }
function render(name: string) {
  const input = { ...base, name }
  return renderToStaticMarkup(<ResultPage session={{ input, result: lifeCodeEngine.calculate(input) }} navigate={() => {}} onReset={() => {}} />)
}

describe('Pending result UI', () => {
  it('renders malicious display names as text, never executable markup', () => {
    const markup = render('<img src=x onerror=alert(1)>')
    expect(markup).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(markup).not.toContain('<img')
    expect(markup).not.toContain('<script')
  })
  it('shows pending status and the date interpretation without a personal code', () => {
    const markup = render('สมชาย')
    expect(markup).toContain('รอยืนยันสูตร')
    expect(markup).toContain('ยังไม่มีการคำนวณตัวเลขหรือแนะนำกลิ่นประจำตัว')
    expect(markup).toContain('1987')
    expect(markup).toContain('2530')
    expect(markup).toContain('ไม่ได้ระบุ')
    expect(markup).not.toMatch(/44\/8|19\/10\/1|1-3-5-8|role="progressbar"|<meter|<progress/)
  })
  it('provides a recovery route when memory is empty after reload', () => {
    const markup = renderToStaticMarkup(<ResultPage session={null} navigate={() => {}} onReset={() => {}} />)
    expect(markup).toContain('กลับไปกรอกข้อมูล')
    expect(markup).not.toContain('สมชาย')
    expect(markup).not.toContain('1987')
  })
})

describe('LINE OA hand-off', () => {
  it('links to the OA chat with the entered name and birth date prefilled', () => {
    const markup = render('สมชาย')
    expect(markup).toContain('https://line.me/R/oaMessage/%40493micst/?')
    expect(markup).toContain(encodeURIComponent('ชื่อ: สมชาย'))
    expect(markup).toContain(encodeURIComponent('15 มีนาคม 2530'))
    expect(markup).toContain('ส่งข้อมูลให้หมอเน่ทาง LINE')
  })
  it('keeps a hostile name inside the encoded query, never as markup', () => {
    const markup = render('<img src=x onerror=alert(1)>')
    expect(markup).not.toContain('<img')
    expect(markup).toContain(encodeURIComponent('<img src=x onerror=alert(1)>'))
  })
})
