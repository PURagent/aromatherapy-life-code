import { z } from 'zod'

const text = z.string().trim().min(1)
const numberId = z.number().int().min(1).max(9)
const chakraId = z.number().int().min(1).max(7)
const reviewFields = {
  status: z.enum(['pending', 'confirmed']),
  ownerConfirmation: z.object({
    confirmedBy: text,
    reference: text,
  }).strict().nullable(),
  reviewNote: text,
  sourceNote: text,
}

const numberSchema = z.object({
  ...reviewFields,
  n: numberId,
  titleTh: text,
  traits: z.array(text),
  focusAreas: z.array(text),
  chakraIds: z.array(chakraId),
  domainIds: z.array(text),
  scentSku: text.nullable(),
  advice: text,
}).strict()

const scentSchema = z.object({
  ...reviewFields,
  sku: text,
  kind: z.enum(['number', 'special']),
  botanicalNameTh: text,
  meaningNameTh: text.nullable(),
  chakraIds: z.array(chakraId),
  priceTHB: z.number().nonnegative().nullable(),
  buyUrl: z.url().refine((value) => {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  }, 'Purchase links must use HTTPS without embedded credentials').nullable(),
}).strict()

const domainSchema = z.object({
  ...reviewFields,
  id: text,
  labelEn: text,
  labelTh: text,
  scentFamilyTh: text,
  numbers: z.array(numberId),
  colorToken: z.string().regex(/^--color-domain-[a-z]+$/),
}).strict()

const chakraSchema = z.object({
  ...reviewFields,
  id: chakraId,
  nameTh: text,
  nameEn: text,
  colorToken: z.string().regex(/^--color-chakra-[1-7]$/),
  keywords: z.array(text),
}).strict()

/** Raw extraction is retained for review; these fields are not public UI content. */
export const contentSchema = z.object({
  numbers: z.array(numberSchema).length(9),
  scents: z.array(scentSchema),
  domains: z.array(domainSchema),
  chakras: z.array(chakraSchema).length(7),
}).strict().superRefine((content, context) => {
  function issue(path: (string | number)[], message: string) {
    context.addIssue({ code: 'custom', path, message })
  }

  for (const [collection, records] of Object.entries(content)) {
    const ids = new Set<string | number>()
    records.forEach((record, index) => {
      const id = 'n' in record ? record.n : 'sku' in record ? record.sku : record.id
      if (ids.has(id)) issue([collection, index], `Duplicate identifier: ${id}`)
      ids.add(id)
      if (record.status === 'confirmed' && !record.ownerConfirmation) {
        issue([collection, index, 'ownerConfirmation'], 'Confirmed content requires an owner and a written confirmation reference')
      }
      if (record.status === 'pending' && record.ownerConfirmation) {
        issue([collection, index, 'ownerConfirmation'], 'Pending content must not claim owner confirmation')
      }
    })
  }

  const scentSkus = new Set(content.scents.map((record) => record.sku))
  const domainIds = new Set(content.domains.map((record) => record.id))
  const chakraIds = new Set(content.chakras.map((record) => record.id))
  const numberIds = new Set(content.numbers.map((record) => record.n))
  content.numbers.forEach((record, index) => {
    if (record.scentSku && !scentSkus.has(record.scentSku)) issue(['numbers', index, 'scentSku'], 'Unknown scent SKU')
    record.domainIds.forEach((id, at) => {
      if (!domainIds.has(id)) issue(['numbers', index, 'domainIds', at], 'Unknown domain ID')
    })
  })
  for (const collection of ['numbers', 'scents'] as const) {
    content[collection].forEach((record, index) => {
      record.chakraIds.forEach((id, at) => {
        if (!chakraIds.has(id)) issue([collection, index, 'chakraIds', at], 'Unknown chakra ID')
      })
    })
  }
  content.domains.forEach((record, index) => {
    record.numbers.forEach((id, at) => {
      if (!numberIds.has(id)) issue(['domains', index, 'numbers', at], 'Unknown number ID')
    })
  })
})

export type ReviewedContent = z.infer<typeof contentSchema>
export type SafeScent = Pick<ReviewedContent['scents'][number], 'sku' | 'kind' | 'botanicalNameTh'>

function safeScent(record: ReviewedContent['scents'][number]): SafeScent {
  return { sku: record.sku, kind: record.kind, botanicalNameTh: record.botanicalNameTh }
}

/** Explicit projection prevents health claims and number/chakra associations escaping. */
export function selectPublicContent(content: ReviewedContent): { scents: SafeScent[] } {
  return { scents: content.scents.filter((record) => record.status === 'confirmed' && record.ownerConfirmation !== null).map(safeScent) }
}

/** Only ordinary scent labels are available for a visibly labelled prototype catalogue. */
export function selectCataloguePreview(content: ReviewedContent) {
  return {
    status: 'draft' as const,
    labelTh: 'ตัวอย่างรายการกลิ่นจากบรีฟ · รอเจ้าของแบรนด์ยืนยัน',
    scents: content.scents.filter((record) => record.kind === 'number').map(safeScent),
  }
}
