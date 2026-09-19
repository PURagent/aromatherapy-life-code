import { describe, expect, it } from 'vitest'
import { featureRoute } from './feature-links'

describe('LINE OA direct links', () => {
  it.each([
    ['/#scent-story', '/'], ['/#begin', '/'], ['/#numbers', '/'],
    ['/#collection', '/scents'], ['/#cart', '/scents'], ['/#privacy', '/privacy'],
    ['/numbers/9', '/numbers/9'], ['/scents', '/scents'], ['/result', '/result'],
  ])('resolves %s to %s', (path, expected) => expect(featureRoute(path)).toBe(expected))
})
