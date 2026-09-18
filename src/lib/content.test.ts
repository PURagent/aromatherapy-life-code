import { describe, expect, it } from 'vitest'
import numbers from '../content/numbers.json'
import scents from '../content/scents.json'
import domains from '../content/domains.json'
import chakras from '../content/chakras.json'
import { contentSchema, selectCataloguePreview, selectPublicContent } from './content-schema'
import { getCataloguePreview, publicContent } from './content'

const source = { numbers, scents, domains, chakras }

describe('reviewed source content', () => {
  it('validates the extracted records and keeps all unapproved content out of public output', () => {
    expect(contentSchema.safeParse(source).success).toBe(true)
    expect(publicContent).toEqual({ scents: [] })
    expect(Object.values(source).flat().every((record) => record.status === 'pending')).toBe(true)
  })

  it('rejects a confirmed label without a written owner confirmation', () => {
    const copy = structuredClone(source)
    copy.scents[0].status = 'confirmed'
    const result = contentSchema.safeParse(copy)
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].path).toEqual(['scents', 0, 'ownerConfirmation'])
  })

  it('rejects duplicate identities and broken associations in draft sources', () => {
    const duplicate = structuredClone(source)
    duplicate.scents[1].sku = duplicate.scents[0].sku
    expect(contentSchema.safeParse(duplicate).success).toBe(false)
    const broken = structuredClone(source)
    broken.numbers[0].scentSku = 'MISSING'
    expect(contentSchema.safeParse(broken).success).toBe(false)
  })

  it('provides an explicitly labelled ordinary-scent preview with only safe catalogue fields', () => {
    const preview = getCataloguePreview()
    expect(preview.status).toBe('draft')
    expect(preview.labelTh).toContain('รอเจ้าของแบรนด์ยืนยัน')
    expect(preview.scents).toHaveLength(9)
    for (const scent of preview.scents) {
      expect(Object.keys(scent).sort()).toEqual(['botanicalNameTh', 'kind', 'sku'])
      expect(scent.kind).toBe('number')
    }
  })

  it('does not expose original meaning, advice, health labels, or chakra IDs even for an approved record', () => {
    const content = contentSchema.parse(source)
    const approved = content.scents[0]
    approved.status = 'confirmed'
    approved.ownerConfirmation = { confirmedBy: 'Test fixture owner', reference: 'test-only confirmation reference' }
    approved.meaningNameTh = 'Internal source text'
    approved.chakraIds = [1, 2]
    const publicResult = selectPublicContent(content)
    expect(publicResult.scents).toEqual([{ sku: approved.sku, kind: approved.kind, botanicalNameTh: approved.botanicalNameTh }])
    expect(selectCataloguePreview(content).scents[0]).toEqual(publicResult.scents[0])
  })

  it('rejects unsafe purchase URLs before content can reach a component', () => {
    const content = contentSchema.parse(source)
    content.scents[0].buyUrl = 'javascript:alert(1)'
    expect(contentSchema.safeParse(content).success).toBe(false)
    content.scents[0].buyUrl = 'https://user:password@example.com/buy'
    expect(contentSchema.safeParse(content).success).toBe(false)
  })
})
