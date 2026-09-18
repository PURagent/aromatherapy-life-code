export type CalendarEra = 'BE' | 'CE'
export type CalendarDate = { year: number; month: number; day: number }
export type BirthDateFields = { year: string | number; month: string | number; day: string | number; era: CalendarEra }
type DateFailure = { ok: false; field: 'year' | 'month' | 'day'; error: string }
type DateSuccess = { ok: true; date: CalendarDate; iso: string }

/** Modern Thai BE numbering only; year conversion must precede date validation. */
export function convertYear(year: number, from: CalendarEra, to: CalendarEra): number {
  if (from === to) return year
  return from === 'BE' ? year - 543 : year + 543
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

export function daysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return 0
  if (month === 2) return isLeapYear(year) ? 29 : 28
  return [4, 6, 9, 11].includes(month) ? 30 : 31
}

/** Uses local calendar components, never UTC slicing or parsing a birth-date string. */
export function localCalendarDate(now = new Date()): CalendarDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }
}

function integerField(value: number | string): number | null {
  if (typeof value === 'number') return Number.isInteger(value) ? value : null
  if (!/^\d+$/.test(value.trim())) return null
  const parsed = Number(value.trim())
  return Number.isSafeInteger(parsed) ? parsed : null
}

function isValidCalendarDate(date: CalendarDate): boolean {
  return Number.isInteger(date.year) && date.year >= 1900 && Number.isInteger(date.day) && date.day >= 1 && date.day <= daysInMonth(date.year, date.month)
}

/** Inject today so validation remains deterministic across time zones and tests. */
export function validateBirthDate(fields: BirthDateFields, today: CalendarDate): DateSuccess | DateFailure {
  if (!isValidCalendarDate(today)) throw new RangeError('today must be a valid Gregorian date from 1900 onward')
  const inputYear = integerField(fields.year)
  const year = inputYear === null ? null : convertYear(inputYear, fields.era, 'CE')
  if (year === null || year < 1900 || year > today.year) {
    const firstYear = convertYear(1900, 'CE', fields.era)
    const lastYear = convertYear(today.year, 'CE', fields.era)
    return { ok: false, field: 'year', error: `กรอกปีเกิดระหว่าง ${firstYear}–${lastYear}` }
  }
  const month = integerField(fields.month)
  if (month === null || month < 1 || month > 12) return { ok: false, field: 'month', error: 'เลือกเดือนเกิดให้ครบถ้วน' }
  const day = integerField(fields.day)
  if (day === null || day < 1 || day > daysInMonth(year, month)) return { ok: false, field: 'day', error: 'กรอกวันที่ที่มีอยู่จริงในเดือนและปีที่เลือก' }
  if (year === today.year && (month > today.month || (month === today.month && day > today.day))) {
    return { ok: false, field: 'day', error: 'วันเกิดต้องไม่เป็นวันที่ในอนาคต' }
  }
  const iso = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  return { ok: true, date: { year, month, day }, iso }
}

export function validateBirthTime(value: string): { ok: true; time: string | null } | { ok: false; error: string } {
  const time = value.trim()
  if (!time) return { ok: true, time: null }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { ok: false, error: 'กรอกเวลาเกิดในรูปแบบ ชั่วโมง:นาที เช่น 09:30 หรือเว้นว่างหากไม่ทราบ' }
  return { ok: true, time }
}
