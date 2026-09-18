import { cataloguePreview } from 'virtual:life-code-content'

export { publicContent } from 'virtual:life-code-content'

/** Dev callers display labelTh; production builds receive an empty catalogue. */
export function getCataloguePreview() {
  return cataloguePreview
}

export type { SafeScent } from './content-schema'
