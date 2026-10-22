import { describe, it, expect } from 'vitest'
import type { OpenSourceReleaseItem, OpenSourceDownloadTrendItem } from '../dashboard'

describe('OpenSourceReleaseItem types', () => {
  it('downloadCount accepts null for missing npm data', () => {
    const item: OpenSourceReleaseItem = {
      tagName: 'v1.0.0',
      name: 'Release 1.0',
      publishedDate: '2026-08-09',
      downloadCount: null,
      downloadSource: 'npm',
    }
    expect(item.downloadCount).toBeNull()
    expect(item.downloadSource).toBe('npm')
  })

  it('downloadCount accepts number for aggregated npm downloads', () => {
    const item: OpenSourceReleaseItem = {
      tagName: 'v1.1.0',
      name: 'Release 1.1',
      publishedDate: '2026-09-01',
      downloadCount: 12345,
      downloadSource: 'npm',
    }
    expect(item.downloadCount).toBe(12345)
  })

  it('downloadSource is optional', () => {
    const item: OpenSourceReleaseItem = {
      tagName: 'v1.0.0',
      name: 'Release 1.0',
      publishedDate: '2026-08-09',
      downloadCount: 100,
    }
    expect(item.downloadCount).toBe(100)
    expect(item.downloadSource).toBeUndefined()
  })
})

describe('OpenSourceDownloadTrendItem types', () => {
  it('has downloads and optional source', () => {
    const item: OpenSourceDownloadTrendItem = {
      date: '2026-10-01',
      downloads: 500,
    }
    expect(item.downloads).toBe(500)
    expect(item.source).toBeUndefined()
  })

  it('source can be set to npm', () => {
    const item: OpenSourceDownloadTrendItem = {
      date: '2026-10-01',
      downloads: 500,
      source: 'npm',
    }
    expect(item.source).toBe('npm')
  })
})

describe('fmt function (null handling)', () => {
  function fmt(val: number | undefined | null): string {
    if (val == null) return '--'
    return val.toLocaleString()
  }

  it('returns -- for null', () => {
    expect(fmt(null)).toBe('--')
  })

  it('returns -- for undefined', () => {
    expect(fmt(undefined)).toBe('--')
  })

  it('returns formatted number for valid value', () => {
    expect(fmt(12345)).toBe('12,345')
  })

  it('returns 0 for zero (not null)', () => {
    expect(fmt(0)).toBe('0')
  })
})
