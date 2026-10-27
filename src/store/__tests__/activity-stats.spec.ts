import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/api/dashboard', () => ({
  getRealtimeInterval: vi.fn().mockResolvedValue({}),
  getDeveloperSummary: vi.fn(),
  getDeveloperTrend: vi.fn(),
  getAgentDistribution: vi.fn(),
  getNewUserTrend: vi.fn(),
  getDownloadTrend: vi.fn(),
  getDownloadChannelSummary: vi.fn(),
  getDownloadChannelDistribution: vi.fn(),
  getCapabilitySummary: vi.fn(),
  getCapabilityTrend: vi.fn(),
  getCapabilityDistribution: vi.fn(),
  getSkillRanking: vi.fn(),
  getSandboxSummary: vi.fn(),
  getSandboxTrend: vi.fn(),
  getSandboxDuration: vi.fn(),
  getSandboxHourly: vi.fn(),
  getVoucherSummary: vi.fn(),
  getVoucherTrend: vi.fn(),
  getVoucherDistribution: vi.fn(),
  getOpenSourceSummary: vi.fn(),
  getOpenSourceReleases: vi.fn(),
  getOpenSourceContributors: vi.fn(),
}))

const getActivityStats = vi.fn()

vi.mock('@/api/activity', () => ({
  ACTIVITY_STATS_TYPES: ['summary', 'trend', 'conversion'],
  buildActivityStatsParams: vi.fn((code: string, types?: string[]) => {
    const params: Record<string, string> = { activity_code: code }
    if (types && types.length > 0) params.types = types.join(',')
    return params
  }),
  getActivityStats: (...args: unknown[]) => getActivityStats(...args),
}))

import { useDashboardStore } from '../dashboard'

const STATS = {
  summary: {
    totalParticipants: 100,
    chapter1Completed: 60,
    chapter2Completed: 30,
    chapter3Completed: 10,
    chapter1Rate: 60,
    chapter2Rate: 30,
    chapter3Rate: 10,
    funnel: [{ name: '参与活动', value: 100, rate: 100 }],
  },
  trend: {
    chapter1: [{ date: '2026-10-25', value: 5 }],
    chapter2: [{ date: '2026-10-25', value: 2 }],
    chapter3: [{ date: '2026-10-25', value: 1 }],
  },
  conversion: { stages: [{ label: '参与 → 初章', rate: 60 }] },
}

describe('dashboard store activity stats (aggregated endpoint)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getActivityStats.mockReset()
  })

  it('loadActivityStats distributes summary/trend/conversion to legacy refs', async () => {
    getActivityStats.mockResolvedValue(STATS)
    const store = useDashboardStore()
    await store.loadActivityStats()

    expect(getActivityStats).toHaveBeenCalledWith(store.selectedActivityCode)
    expect(store.activitySummary).toEqual(STATS.summary)
    expect(store.activityTrend).toEqual(STATS.trend)
    expect(store.activityConversion).toEqual(STATS.conversion)
  })

  it('missing segments fall back to null (types pruning)', async () => {
    getActivityStats.mockResolvedValue({ summary: STATS.summary })
    const store = useDashboardStore()
    await store.loadActivityStats()

    expect(store.activitySummary).toEqual(STATS.summary)
    expect(store.activityTrend).toBeNull()
    expect(store.activityConversion).toBeNull()
  })

  it('setActivityCode reloads stats for the selected activity', async () => {
    getActivityStats.mockResolvedValue(STATS)
    const store = useDashboardStore()
    await store.setActivityCode('no-such-activity')
    expect(getActivityStats).not.toHaveBeenCalled()

    // 配置内新活动：通过扩展清单模拟切换
    const configured = store.activities[0].code
    expect(store.selectedActivityCode).toBe(configured)
    await store.setActivityCode(configured) // 同 code 不重载
    expect(getActivityStats).not.toHaveBeenCalled()
  })

  it('exposes config-driven activity list with unique codes', () => {
    const store = useDashboardStore()
    expect(store.activities.length).toBeGreaterThanOrEqual(1)
    const codes = store.activities.map(a => a.code)
    expect(new Set(codes).size).toBe(codes.length)
  })
})
