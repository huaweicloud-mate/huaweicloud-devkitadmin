import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/api/activity', () => ({
  getActivityList: vi.fn(),
  getActivityStats: vi.fn(),
}))

import * as activityApi from '@/api/activity'
import { useDashboardStore } from '@/store/dashboard'
import { ALL_ACTIVITY_CODE } from '@/pages/dashboard/data/activity-config'

const mockedGetActivityList = vi.mocked(activityApi.getActivityList)
const mockedGetActivityStats = vi.mocked(activityApi.getActivityStats)

function item(code: string, total: number, c1: number, c2: number, c3: number) {
  return {
    code,
    name: `活动-${code}`,
    summary: {
      totalParticipants: total,
      chapter1Completed: c1,
      chapter2Completed: c2,
      chapter3Completed: c3,
      chapter1Rate: total ? Math.round((c1 / total) * 1000) / 10 : 0,
      chapter2Rate: total ? Math.round((c2 / total) * 1000) / 10 : 0,
      chapter3Rate: total ? Math.round((c3 / total) * 1000) / 10 : 0,
      funnel: [],
    },
    trend: { chapter1: [], chapter2: [], chapter3: [] },
    conversion: { stages: [] },
  }
}

function multiResponse(a = item('a-1', 100, 60, 30, 10), b = item('a-2', 50, 20, 10, 5)) {
  return {
    all: {
      summary: {
        totalParticipants: a.summary!.totalParticipants + b.summary!.totalParticipants,
        chapter1Completed: a.summary!.chapter1Completed + b.summary!.chapter1Completed,
        chapter2Completed: a.summary!.chapter2Completed + b.summary!.chapter2Completed,
        chapter3Completed: a.summary!.chapter3Completed + b.summary!.chapter3Completed,
        chapter1Rate: 53.3,
        chapter2Rate: 26.7,
        chapter3Rate: 10,
        funnel: [],
      },
      trend: { chapter1: [], chapter2: [], chapter3: [] },
      conversion: { stages: [] },
    },
    items: [a, b],
  }
}

describe('活动统计多选对比 store（Issue #119）', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
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
    expect(store.activitySummary?.chapter1Completed).toBe(80)
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
})
