import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/api/activity', () => ({
  getActivityList: vi.fn(),
  getActivityCodes: vi.fn(),
  getActivityStats: vi.fn(),
}))

import * as activityApi from '@/api/activity'
import { useDashboardStore } from '@/store/dashboard'
import { ALL_ACTIVITY_CODE } from '@/pages/dashboard/data/activity-config'

const mockedGetActivityList = vi.mocked(activityApi.getActivityList)
const mockedGetActivityCodes = vi.mocked(activityApi.getActivityCodes)
const mockedGetActivityStats = vi.mocked(activityApi.getActivityStats)

function stage(key: string, label: string, value: number, total: number) {
  return { key, label, value, rate: total ? Math.round((value / total) * 1000) / 10 : 0 }
}

function item(code: string, total: number, c1: number, c2: number, c3: number) {
  return {
    code,
    name: `活动-${code}`,
    summary: {
      totalParticipants: total,
      stages: [
        stage('beginner', '初章', c1, total),
        stage('intermediate', '进阶章', c2, total),
        stage('advanced', '终章', c3, total),
      ],
    },
    trend: { stages: [] },
    conversion: { stages: [] },
  }
}

function multiResponse(a = item('a-1', 100, 60, 30, 10), b = item('a-2', 50, 20, 10, 5)) {
  return {
    all: {
      summary: {
        totalParticipants: 150,
        stages: [
          { key: 'beginner', label: '初章', value: 80, rate: 53.3 },
          { key: 'intermediate', label: '进阶章', value: 40, rate: 26.7 },
          { key: 'advanced', label: '终章', value: 15, rate: 10 },
        ],
      },
      trend: { stages: [] },
      conversion: { stages: [] },
    },
    items: [a, b],
  }
}

describe('活动统计多选对比 store（Issue #119）', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockedGetActivityCodes.mockResolvedValue([])
  })

  it('列表非空时默认勾选第一个（最新有数据活动）', async () => {
    mockedGetActivityList.mockResolvedValue([
      { code: 'a-1', name: '活动一', latest_snapshot_date: '2026-10-31' },
      { code: 'a-2', name: '活动二', latest_snapshot_date: '2026-10-30' },
    ] as any)
    mockedGetActivityStats.mockResolvedValue(multiResponse() as any)

    const store = useDashboardStore()
    await store.loadActivityBoard()

    expect(store.selectedActivityCodes).toEqual(['a-1'])
    // 默认单选：请求只带该码
    expect(mockedGetActivityStats).toHaveBeenCalledWith(['a-1'])
  })

  it('列表为空时兜底勾选「全部活动·汇总」', async () => {
    mockedGetActivityList.mockResolvedValue([] as any)
    mockedGetActivityStats.mockResolvedValue({
      all: { summary: null, trend: null, conversion: null },
      items: [],
    } as any)

    const store = useDashboardStore()
    await store.loadActivityBoard()

    expect(store.selectedActivityCodes).toEqual([ALL_ACTIVITY_CODE])
    // 空参 = 全部活动
    expect(mockedGetActivityStats).toHaveBeenCalledWith([])
  })

  it('列表存在但无最近快照时间时兜底勾选「全部」', async () => {
    mockedGetActivityList.mockResolvedValue([
      { code: 'a-1', name: '活动一', latest_snapshot_date: null },
    ] as any)
    mockedGetActivityStats.mockResolvedValue({
      all: { summary: null, trend: null, conversion: null },
      items: [],
    } as any)

    const store = useDashboardStore()
    await store.loadActivityBoard()

    expect(store.selectedActivityCodes).toEqual([ALL_ACTIVITY_CODE])
  })

  it('多选时 activitySummary 取跨活动求和汇总（all 段）', async () => {
    mockedGetActivityList.mockResolvedValue([
      { code: 'a-1', name: '活动一', latest_snapshot_date: '2026-10-31' },
      { code: 'a-2', name: '活动二', latest_snapshot_date: '2026-10-30' },
    ] as any)
    mockedGetActivityStats.mockResolvedValue(multiResponse() as any)

    const store = useDashboardStore()
    await store.loadActivityBoard()
    await store.selectActivities(['a-1', 'a-2'])

    expect(mockedGetActivityStats).toHaveBeenLastCalledWith(['a-1', 'a-2'])
    expect(store.isActivityMulti).toBe(true)
    expect(store.selectedActivityItems).toHaveLength(2)
    // 汇总 = 100 + 50
    expect(store.activitySummary?.totalParticipants).toBe(150)
    expect(store.activitySummary?.stages[0].value).toBe(80)
  })

  it('单选时 activitySummary 指向该活动数据（与现状一致）', async () => {
    mockedGetActivityList.mockResolvedValue([
      { code: 'a-1', name: '活动一', latest_snapshot_date: '2026-10-31' },
      { code: 'a-2', name: '活动二', latest_snapshot_date: '2026-10-30' },
    ] as any)
    mockedGetActivityStats.mockResolvedValue(multiResponse() as any)

    const store = useDashboardStore()
    await store.loadActivityBoard()
    await store.selectActivities(['a-2'])

    expect(mockedGetActivityStats).toHaveBeenLastCalledWith(['a-2'])
    expect(store.isActivityMulti).toBe(false)
    expect(store.selectedActivityItems).toHaveLength(1)
    expect(store.activitySummary?.totalParticipants).toBe(50)
  })

  it('勾「全部」时忽略其它码且请求空参（全部活动）', async () => {
    mockedGetActivityList.mockResolvedValue([
      { code: 'a-1', name: '活动一', latest_snapshot_date: '2026-10-31' },
    ] as any)
    mockedGetActivityStats.mockResolvedValue(multiResponse() as any)

    const store = useDashboardStore()
    await store.loadActivityBoard()
    await store.selectActivities(['a-1', ALL_ACTIVITY_CODE])

    expect(store.selectedActivityCodes).toEqual([ALL_ACTIVITY_CODE])
    expect(mockedGetActivityStats).toHaveBeenLastCalledWith([])
    // 全部 + 多活动 → 多选视图，items 全量
    expect(store.selectedActivityItems).toHaveLength(2)
  })

  it('配置里无数据的活动也出现在下拉列表中（暂无快照）', async () => {
    mockedGetActivityCodes.mockResolvedValue([
      { code: 'open-capability-2026-1024', name: '闯关活动' },
      { code: 'a-1', name: '活动一' },
    ] as any)
    mockedGetActivityList.mockResolvedValue([
      { code: 'a-1', name: '活动一', latest_snapshot_date: '2026-10-31' },
    ] as any)
    mockedGetActivityStats.mockResolvedValue(multiResponse() as any)

    const store = useDashboardStore()
    await store.loadActivityBoard()

    // 无数据的 1024 也出现在列表里
    expect(store.activityList.map(a => a.code)).toContain('open-capability-2026-1024')
    // 无数据的活动 latest_snapshot_date 为 null
    const noData = store.activityList.find(a => a.code === 'open-capability-2026-1024')
    expect(noData?.latest_snapshot_date).toBeNull()
    // 有数据的活动仍默认优先勾选
    expect(store.selectedActivityCodes).toEqual(['a-1'])
  })
})