import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, normalizePath, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { contentSchema, selectCataloguePreview, selectPublicContent } from './src/lib/content-schema.ts'

const contentModuleId = 'virtual:life-code-content'
const resolvedContentModuleId = `\0${contentModuleId}`
const collections = ['numbers', 'scents', 'domains', 'chakras'] as const
const contentFiles = collections.map((name) => new URL(`./src/content/${name}.json`, import.meta.url))

function readReviewedContent() {
  const input = Object.fromEntries(collections.map((name, index) => [
    name,
    JSON.parse(readFileSync(contentFiles[index], 'utf8')),
  ]))
  return contentSchema.parse(input)
}

/** Raw extraction and its validator run in Node; the browser receives only this projection. */
function reviewedContentPlugin(allowDraftPreview: boolean): Plugin {
  return {
    name: 'reviewed-life-code-content',
    buildStart() {
      readReviewedContent()
      contentFiles.forEach((file) => this.addWatchFile(fileURLToPath(file)))
    },
    resolveId(id) {
      return id === contentModuleId ? resolvedContentModuleId : null
    },
    load(id) {
      if (id !== resolvedContentModuleId) return null
      const reviewed = readReviewedContent()
      const publicContent = selectPublicContent(reviewed)
      const cataloguePreview = allowDraftPreview
        ? selectCataloguePreview(reviewed)
        : { status: 'draft', labelTh: '', scents: [] }
      return [
        `export const publicContent = ${JSON.stringify(publicContent)};`,
        `export const cataloguePreview = ${JSON.stringify(cataloguePreview)};`,
      ].join('\n')
    },
    handleHotUpdate(context) {
      if (!contentFiles.some((file) => normalizePath(fileURLToPath(file)) === normalizePath(context.file))) return
      // Validate edits before replacing the current safe catalogue.
      readReviewedContent()
      const virtualModule = context.server.moduleGraph.getModuleById(resolvedContentModuleId)
      if (virtualModule) context.server.moduleGraph.invalidateModule(virtualModule)
      context.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}

export default defineConfig(({ command, mode }) => ({
  base: '/',
  build: { manifest: true },
  plugins: [
    reviewedContentPlugin(command === 'serve' && mode !== 'production'),
    react(),
    tailwindcss(),
  ],
}))
