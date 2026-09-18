/// <reference types="vite/client" />

declare module 'virtual:life-code-content' {
  export const publicContent: ReturnType<typeof import('./lib/content-schema').selectPublicContent>
  export const cataloguePreview: ReturnType<typeof import('./lib/content-schema').selectCataloguePreview>
}
