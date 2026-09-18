import { describe, expect, it, vi } from 'vitest'
import ownerFixtures from '../content/engine-fixtures.json'
import { lifeCodeEngine } from './index'
import type { LifeCodeInput } from './index'

const inputs: LifeCodeInput[] = [
  {
    name: 'มาลี',
    birthDate: { year: 1987, month: 3, day: 15 },
    birthTime: null,
  },
  {
    name: 'สมชาย ทดสอบ',
    birthDate: { year: 2000, month: 2, day: 29 },
    birthTime: { hour: 0, minute: 0 },
  },
  {
    name: 'Alice',
    birthDate: { year: 1999, month: 12, day: 31 },
    birthTime: { hour: 23, minute: 59 },
  },
  {
    name: '<img src=x onerror=alert(1)>',
    birthDate: { year: 2024, month: 1, day: 1 },
    birthTime: { hour: 12, minute: 30 },
  },
  {
    name: '',
    birthDate: { year: 0, month: 0, day: 0 },
    birthTime: null,
  },
]

describe('LifeCodeEngine while the owner formula is missing', () => {
  it.each(inputs)('returns an explicit pending state for input %#', (input) => {
    const result = lifeCodeEngine.calculate(input)

    expect(result.status).toBe('pending-confirmation')
    expect(result.engineId).toBe(lifeCodeEngine.id)
    expect(result.title).toContain('รอการยืนยัน')
    expect(result.message).toContain('ยังไม่แสดงรหัส')
    expect(result.message).toContain('สูตรและตัวอย่างที่ยืนยันโดยหมอเน่')

    // Allow only honest status copy, never a fallback personal result or echoed PII.
    expect(Object.keys(result).sort()).toEqual([
      'engineId',
      'message',
      'status',
      'title',
    ])
  })

  it('does not turn variations of name, birth date, or time into different codes', () => {
    const baseline = inputs[0]
    const result = lifeCodeEngine.calculate(baseline)

    for (const variant of inputs.slice(1)) {
      for (const input of [
        { ...baseline, name: variant.name },
        { ...baseline, birthDate: variant.birthDate },
        { ...baseline, birthTime: variant.birthTime },
      ]) {
        expect(lifeCodeEngine.calculate(input)).toEqual(result)
      }
    }
  })

  it('does not mutate or retain personal input', () => {
    const input = structuredClone(inputs[1])
    const original = structuredClone(input)
    Object.freeze(input.birthDate)
    Object.freeze(input.birthTime)
    Object.freeze(input)

    const result = lifeCodeEngine.calculate(input)

    expect(input).toEqual(original)
    expect(JSON.stringify(result)).not.toContain(input.name)
    expect(JSON.stringify(result)).not.toContain(String(input.birthDate.year))
    expect(Object.values(result)).not.toContain(input)
    expect(Object.isFrozen(result)).toBe(true)
  })

  it('makes no logging, network, or browser-storage calls', () => {
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map(
      (method) => vi.spyOn(console, method).mockImplementation(() => undefined),
    )
    const fetchSpy = vi.fn()
    const storageSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    vi.stubGlobal('localStorage', { setItem: storageSpy, getItem: storageSpy })
    vi.stubGlobal('sessionStorage', { setItem: storageSpy, getItem: storageSpy })

    try {
      for (const input of inputs) lifeCodeEngine.calculate(input)
      for (const spy of [...spies, fetchSpy, storageSpy]) {
        expect(spy).not.toHaveBeenCalled()
      }
    } finally {
      vi.restoreAllMocks()
      vi.unstubAllGlobals()
    }
  })

  it('keeps missing owner fixtures empty and does not treat them as formula validation', () => {
    expect(ownerFixtures).toEqual([])
    expect(lifeCodeEngine.calculate(inputs[0]).status).toBe('pending-confirmation')
  })
})
