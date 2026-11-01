import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../api/axios', () => ({
  default: { get: vi.fn() },
}))

import http from '../../api/axios'
import { getActivityList, getActivityStats } from '../../api/activity'

const mockedGet = vi.mocked(http.get)

describe('getActivityList (GET /activity/list)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('requests the activity list endpoint', async () => {
    mockedGet.mockResolvedValue([
      { code: 'a-1', name: '活动一', latest_snapshot_date: '2026-10-31' },
    ])
    const list = await getActivityList()
    expect(mockedGet).toHaveBeenCalledWith(
      '/rest/developer/server/hdkitservice/dashboard/activity/list',
    )
    expect(list).toHaveLength(1)
  })
})

describe('getActivityStats (GET /activity/stats multi-code)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('omits activity_code when codes is empty (= 全部活动)', async () => {
    mockedGet.mockResolvedValue({ all: {}, items: [] })
    await getActivityStats([])
    expect(mockedGet).toHaveBeenCalledWith(
      '/rest/developer/server/hdkitservice/dashboard/activity/stats',
    )
  })

  it('omits activity_code when codes is undefined', async () => {
    mockedGet.mockResolvedValue({ all: {}, items: [] })
    await getActivityStats()
    expect(mockedGet).toHaveBeenCalledWith(
      '/rest/developer/server/hdkitservice/dashboard/activity/stats',
    )
  })

  it('single code appends one activity_code param', async () => {
    mockedGet.mockResolvedValue({ all: {}, items: [] })
    await getActivityStats(['a-1'])
    expect(mockedGet).toHaveBeenCalledWith(
      '/rest/developer/server/hdkitservice/dashboard/activity/stats?activity_code=a-1',
    )
  })

  it('multi codes send repeated activity_code params', async () => {
    mockedGet.mockResolvedValue({ all: {}, items: [] })
    await getActivityStats(['a-1', 'a-2'])
    expect(mockedGet).toHaveBeenCalledWith(
      '/rest/developer/server/hdkitservice/dashboard/activity/stats?activity_code=a-1&activity_code=a-2',
    )
  })
})
