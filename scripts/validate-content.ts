import { readFileSync } from 'node:fs'
import { contentSchema } from '../src/lib/content-schema.ts'

const collections = ['numbers', 'scents', 'domains', 'chakras'] as const
const input = Object.fromEntries(collections.map((name) => [name, JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'))]))
const result = contentSchema.safeParse(input)

if (!result.success) {
  for (const issue of result.error.issues) {
    console.error(`${issue.path.join('.')}: ${issue.message}`)
  }
  process.exitCode = 1
} else {
  const records = collections.flatMap((collection) => result.data[collection])
  const confirmed = records.filter((record) => record.status === 'confirmed').length
  console.log(`Content valid: ${records.length} records; ${confirmed} owner-confirmed, ${records.length - confirmed} pending review. Validation does not constitute formula or content approval.`)
}
