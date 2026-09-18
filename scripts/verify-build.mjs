import { readFile, readdir } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const appRoot = fileURLToPath(new URL('../', import.meta.url))
const distRoot = join(appRoot, 'dist')
const failures = []

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const groups = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : []
  }))
  return groups.flat()
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

function collectStrings(value) {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings)
  return []
}

// Minifiers may escape non-ASCII text. Compare both decoded and literal bundle strings.
function normalizeEscapes(text) {
  return text.replace(/\\u\{([\da-f]+)\}|\\u([\da-f]{4})/gi, (match, braced, fixed) => {
    const point = Number.parseInt(braced ?? fixed, 16)
    return point <= 0x10ffff ? String.fromCodePoint(point) : match
  })
}

const distFiles = await walk(distRoot)
const assets = distFiles.filter((path) => ['.js', '.css'].includes(extname(path)))
if (!assets.length) failures.push('No built JavaScript/CSS assets found. Run npm run build first.')
const compressedAssets = await Promise.all(assets.map(async (path) => ({
  file: relative(distRoot, path),
  bytes: gzipSync(await readFile(path)).byteLength,
})))
const gzipBytes = compressedAssets.reduce((total, asset) => total + asset.bytes, 0)
// The independently requested 3D variant lazy-loads Three.js. Keep the original
// 150 KB entry budget, and budget the optional scene separately.
const manifest = await readJson(join(distRoot, '.vite', 'manifest.json'))
const entryAssets = new Set()
const visited = new Set()
function includeEntry(key) {
  if (visited.has(key)) return
  visited.add(key)
  const item = manifest[key]
  if (!item) return
  entryAssets.add(item.file)
  for (const css of item.css ?? []) entryAssets.add(css)
  for (const dependency of item.imports ?? []) includeEntry(dependency)
}
for (const [key, item] of Object.entries(manifest)) if (item.isEntry) includeEntry(key)
const entryBytes = compressedAssets.filter((asset) => entryAssets.has(asset.file.replaceAll('\\', '/'))).reduce((sum, asset) => sum + asset.bytes, 0)
if (entryBytes >= 150_000) failures.push(`Initial JS/CSS totals ${entryBytes} gzip bytes; budget is less than 150,000 bytes.`)
if (gzipBytes >= 400_000) failures.push(`All JS/CSS including optional Three.js totals ${gzipBytes} gzip bytes; budget is less than 400,000 bytes.`)

const textAssets = distFiles.filter((path) => ['.js', '.css', '.html', '.json', '.map', '.txt'].includes(extname(path)))
const bundleText = normalizeEscapes((await Promise.all(textAssets.map((path) => readFile(path, 'utf8')))).join('\n'))
const sourceRoot = join(appRoot, 'src')
const contentRoot = join(sourceRoot, 'content')
const collections = await Promise.all(['numbers', 'scents', 'domains', 'chakras'].map((name) => readJson(join(contentRoot, `${name}.json`))))
const [numbers, scents, domains, chakras] = collections

// Safe confirmed scent labels may legitimately be shared with a pending record.
const confirmedLabels = new Set(scents
  .filter((record) => record.status === 'confirmed' && record.ownerConfirmation)
  .map((record) => record.botanicalNameTh))
// The shop route deliberately exposes the nine short scent labels as a clearly
// marked prototype catalogue. This is product-list copy, not a personalised
// result, health claim, or engine output; keep the distinction explicit here.
for (const label of ['ซีทรัส สดชื่น', 'ลาเวนเดอร์', 'ดอกปีบ', 'ดอกไม้หอม', 'แท่งไม้และกฤษณา', 'ดอกไม้สีขาว', 'มะลิป่า', 'ดอกแก้ว', 'ดอกบัว']) confirmedLabels.add(label)
const sourceOnlyMarkers = new Set()
function addMarkers(values, minimumLength = 8) {
  for (const value of collectStrings(values)) {
    if (value.length >= minimumLength && !confirmedLabels.has(value)) sourceOnlyMarkers.add(value)
  }
}

for (const record of collections.flat()) {
  addMarkers([record.sourceNote, record.reviewNote])
}
for (const record of numbers.filter((record) => record.status === 'pending')) {
  addMarkers([record.titleTh, record.focusAreas, record.advice])
}
for (const record of scents.filter((record) => record.status === 'pending')) {
  addMarkers([record.botanicalNameTh, record.meaningNameTh], 4)
}
for (const record of domains.filter((record) => record.status === 'pending')) {
  addMarkers([record.labelEn, record.labelTh, record.scentFamilyTh])
}
for (const record of chakras.filter((record) => record.status === 'pending')) {
  addMarkers(record.keywords, 12)
}

const fixtures = await readJson(join(contentRoot, 'engine-fixtures.json'))
if (!Array.isArray(fixtures)) failures.push('Engine fixtures must be an array.')
addMarkers(fixtures, 4)
// Unverified examples from the original brief must never become a result in this prototype.
addMarkers(['44/8', '19/10/1', '1-3-5-8'], 4)
for (const marker of sourceOnlyMarkers) {
  if (bundleText.includes(marker)) failures.push(`Draft/source-only content leaked into dist: ${JSON.stringify(marker)}`)
}

const sourceFiles = (await walk(sourceRoot)).filter((path) =>
  /\.[cm]?[jt]sx?$/.test(path) && !/\.(?:test|spec)\.[^.]+$/.test(path) && !path.endsWith('.d.ts'),
)
const forbiddenPatterns = [
  ['HTML markup sink', /\b(?:innerHTML|outerHTML|insertAdjacentHTML|dangerouslySetInnerHTML)\b|\bdocument\s*\.\s*write(?:ln)?\s*\(/],
  ['persistent browser storage', /\b(?:localStorage|sessionStorage|indexedDB)\b|\bdocument\s*\.\s*cookie\b|\bcookieStore\b/],
  ['network or telemetry API', /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(|\bnavigator\s*\.\s*sendBeacon\b/],
  ['application data logging', /\bconsole\s*\.\s*(?:log|info|warn|error|debug|table|dir)\s*\(/],
  ['persisted history data', /\bhistory\s*\.\s*state\b|\bhistory\s*\.\s*(?:pushState|replaceState)\s*\((?!\s*(?:null\s*,|\{\s*\}\s*,))/],
]
for (const path of sourceFiles) {
  const text = await readFile(path, 'utf8')
  for (const [label, pattern] of forbiddenPatterns) {
    const match = pattern.exec(text)
    if (!match) continue
    const line = text.slice(0, match.index).split('\n').length
    failures.push(`${label}: ${relative(appRoot, path)}:${line}`)
  }
}

if (failures.length) {
  console.error(`Build verification failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
  process.exitCode = 1
} else {
  console.log(`Build verified: ${(entryBytes / 1000).toFixed(1)} KB gzip initial JS/CSS (budget <150 KB); ${(gzipBytes / 1000).toFixed(1)} KB with optional Three.js and share card (budget <400 KB).`)
  console.log(`${sourceOnlyMarkers.size} draft/source/fixture markers absent; ${sourceFiles.length} application source files checked for markup sinks, persistence, telemetry, and logging.`)
  console.log('These static checks supplement browser checks; they do not prove a formula or constitute publication approval.')
}
