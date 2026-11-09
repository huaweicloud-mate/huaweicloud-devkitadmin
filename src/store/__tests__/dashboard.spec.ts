import { describe, it, expect } from 'vitest'
import type {
  OpenSourceReleaseItem,
  OpenSourceDownloadTrendItem,
  SandboxSummary,
  SandboxRevisitInterval,
  SandboxIdle,
  SandboxErrorStats,
  SandboxCostBreakdown,
} from '../dashboard'

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

// ==================== Issue #134: CLI KPI + 沙箱观测类型 + #113 空态 ====================

describe('CapabilitySummary types', () => {
  it('includes cliCalls KPI (#115/#134)', () => {
    const s = {
      totalCalls: 100,
      uniqueUsers: 10,
      dailyAvgCalls: 10,
      todayCalls: 5,
      skillCalls: 50,
      mcpCalls: 30,
      cliCalls: 20,
    }
    expect(s.cliCalls).toBe(20)
    expect(s.skillCalls + s.mcpCalls + s.cliCalls).toBe(100)
  })
})

describe('SandboxSummary null handling (#113)', () => {
  it('avgDurationSec / avgDurationDeltaSec accept null for empty state', () => {
    const s: SandboxSummary = {
      totalUsers: 0,
      dailyUsers: 0,
      dailyUsersChainRatio: 0,
      avgDurationSec: null,
      avgDurationDeltaSec: null,
      slaTarget: '99%',
    }
    expect(s.avgDurationSec).toBeNull()
    expect(s.avgDurationDeltaSec).toBeNull()
    expect(s.avgDurationSec != null ? s.avgDurationSec.toFixed(1) : '--').toBe('--')
  })
})

describe('Sandbox observation types (#121 DTO alignment)', () => {
  it('SandboxRevisitInterval carries 6 buckets + p50/p90', () => {
    const d: SandboxRevisitInterval = {
      windowStart: '2026-10-03',
      windowEnd: '2026-11-01',
      p50Seconds: 3600,
      p90Seconds: 86400,
      buckets: [
        { label: '<1h', order: 1, count: 3 },
        { label: '1-24h', order: 2, count: 5 },
      ],
      note: 'connect 事件近似口径',
    }
    expect(d.p50Seconds).toBe(3600)
    expect(d.buckets).toHaveLength(2)
  })

  it('SandboxIdle carries thresholds', () => {
    const d: SandboxIdle = {
      windowStart: '2026-10-03',
      windowEnd: '2026-11-01',
      distinctDevStages: 12,
      buckets: [{ label: '<24h', order: 1, count: 7 }],
      thresholds: [
        { thresholdHours: 24, count: 5 },
        { thresholdHours: 72, count: 2 },
      ],
      note: '用户最后使用时间非实时',
    }
    expect(d.thresholds.find(t => t.thresholdHours === 72)?.count).toBe(2)
  })

  it('SandboxErrorStats carries failRate + topErrorCodes + slowestConnects', () => {
    const d: SandboxErrorStats = {
      windowStart: '2026-10-03',
      windowEnd: '2026-11-01',
      totalEvents: 100,
      failEvents: 4,
      failRate: 4.0,
      topErrorCodes: [{ errorCode: 'APIGW.0301', count: 3 }],
      slowestConnects: [{ devStageId: 'ds-1', durationMs: 60000, errorCode: null, createdAt: '2026-10-20T10:00:00Z' }],
      dailyTrend: [{ date: '2026-10-20', total: 10, success: 9, successRate: 90 }],
    }
    expect(d.failRate).toBe(4.0)
    expect(d.topErrorCodes[0].count).toBe(3)
  })

  it('SandboxCostBreakdown carries items + total', () => {
    const d: SandboxCostBreakdown = {
      windowStart: '2026-10-03',
      windowEnd: '2026-11-01',
      items: [{ templateId: 'web-ide', flavorId: 'c7.large.2', createCount: 40, distinctUsers: 25 }],
      total: { templateId: 'ALL', flavorId: 'ALL', createCount: 40, distinctUsers: 25 },
    }
    expect(d.items[0].createCount).toBe(40)
    expect(d.total?.distinctUsers).toBe(25)
  })
})
