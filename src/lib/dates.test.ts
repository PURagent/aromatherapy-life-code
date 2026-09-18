import { describe, expect, it } from 'vitest'
import { convertYear, localCalendarDate, validateBirthDate, validateBirthTime } from './dates'

const today = { year: 2026, month: 9, day: 9 }

describe('birth-date form validation', () => {
  it('normalizes the same BE and CE leap day to the same Gregorian value', () => {
    const ce = validateBirthDate({ year: '2000', month: '02', day: '29', era: 'CE' }, today)
    const be = validateBirthDate({ year: '2543', month: '02', day: '29', era: 'BE' }, today)
    expect(be).toEqual(ce)
    expect(ce).toEqual({ ok: true, date: { year: 2000, month: 2, day: 29 }, iso: '2000-02-29' })
  })

  it.each([
    { year: '1900', month: '2', day: '29', era: 'CE' as const },
    { year: '2025', month: '2', day: '29', era: 'CE' as const },
    { year: '2024', month: '4', day: '31', era: 'CE' as const },
    { year: '1900', month: '0', day: '1', era: 'CE' as const },
    { year: '1900', month: '1', day: '0', era: 'CE' as const },
    { year: '2026', month: '9', day: '10', era: 'CE' as const },
    { year: '2026', month: '10', day: '1', era: 'CE' as const },
    { year: '2027', month: '1', day: '1', era: 'CE' as const },
    { year: '2442', month: '1', day: '1', era: 'BE' as const },
    { year: '', month: '1', day: '1', era: 'CE' as const },
    { year: '2e3', month: '1', day: '1', era: 'CE' as const },
    { year: '2000', month: '1.5', day: '1', era: 'CE' as const },
    { year: '2000', month: '1', day: '1/2', era: 'CE' as const },
  ])('rejects invalid or future input: %j', (input) => {
    expect(validateBirthDate(input, today).ok).toBe(false)
  })

  it('accepts today and the inclusive oldest supported date', () => {
    expect(validateBirthDate({ ...today, era: 'CE' }, today).ok).toBe(true)
    expect(validateBirthDate({ year: 2443, month: 1, day: 1, era: 'BE' }, today)).toEqual({
      ok: true, date: { year: 1900, month: 1, day: 1 }, iso: '1900-01-01',
    })
  })

  it('keeps calendar conversion reversible without applying date parsing', () => {
    const be = convertYear(2000, 'CE', 'BE')
    expect(be).toBe(2543)
    expect(convertYear(be, 'BE', 'CE')).toBe(2000)
    expect(convertYear(be, 'BE', 'BE')).toBe(be)
  })

  it('reads local date components without using UTC date slicing', () => {
    expect(localCalendarDate(new Date(2026, 8, 9, 0, 1))).toEqual(today)
  })

  it('rejects invalid injected today instead of silently allowing future dates', () => {
    expect(() => validateBirthDate({ ...today, era: 'CE' }, { year: 2026, month: 2, day: 30 })).toThrow(RangeError)
  })
})

describe('optional birth time', () => {
  it('accepts an unknown time and clock boundaries', () => {
    expect(validateBirthTime('   ')).toEqual({ ok: true, time: null })
    expect(validateBirthTime('00:00')).toEqual({ ok: true, time: '00:00' })
    expect(validateBirthTime('23:59')).toEqual({ ok: true, time: '23:59' })
  })

  it.each(['24:00', '09:60', '9:30', '12:00:00', '-1:00', '12:ab'])('rejects malformed or impossible time %s', (time) => {
    expect(validateBirthTime(time).ok).toBe(false)
  })
})
