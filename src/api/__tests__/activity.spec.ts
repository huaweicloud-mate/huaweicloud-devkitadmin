import { describe, it, expect } from 'vitest'
import { buildActivityStatsParams, ACTIVITY_STATS_TYPES, type ActivityStatsType } from '../../api/activity'

describe('buildActivityStatsParams (GET /activity/stats)', () => {
  it('builds params with activity_code only when types omitted', () => {
    expect(buildActivityStatsParams('open-capability-2026-1024')).toEqual({
      activity_code: 'open-capability-2026-1024',
    })
  })

  it('joins types as comma-separated string', () => {
    const types: ActivityStatsType[] = ['summary', 'trend']
    expect(buildActivityStatsParams('a-1', types)).toEqual({
      activity_code: 'a-1',
      types: 'summary,trend',
    })
  })

  it('single type produces single-element types param', () => {
    expect(buildActivityStatsParams('a-1', ['summary'])).toEqual({
      activity_code: 'a-1',
      types: 'summary',
    })
  })

  it('empty types array omits types param (server returns all)', () => {
    expect(buildActivityStatsParams('a-1', [])).toEqual({ activity_code: 'a-1' })
  })

  it('all three types are the contract values', () => {
    expect(ACTIVITY_STATS_TYPES).toEqual(['summary', 'trend', 'conversion'])
  })
})
