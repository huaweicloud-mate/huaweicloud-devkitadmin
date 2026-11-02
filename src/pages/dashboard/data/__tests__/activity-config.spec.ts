import { describe, it, expect } from 'vitest'
import {
  ALL_ACTIVITY_CODE,
  ALL_ACTIVITY_LABEL,
  MULTI_SUM_NOTE,
  activityDisplayName,
  ACTIVITY_NAME_OVERRIDES,
} from '../activity-config'

describe('activity-config（Issue #119 覆盖语义）', () => {
  it('全部活动虚拟选项常量已定义', () => {
    expect(ALL_ACTIVITY_CODE).toBe('__all__')
    expect(ALL_ACTIVITY_LABEL).toBe('全部活动·汇总')
  })

  it('汇总行口径标注说明跨活动求和可能重复计数', () => {
    expect(MULTI_SUM_NOTE).toContain('重复计数')
  })

  it('activityDisplayName：覆盖表优先', () => {
    ACTIVITY_NAME_OVERRIDES['a-1'] = '覆盖名'
    expect(activityDisplayName('a-1', '后端名')).toBe('覆盖名')
    delete ACTIVITY_NAME_OVERRIDES['a-1']
  })

  it('activityDisplayName：后端名兜底，再兜底 code', () => {
    expect(activityDisplayName('a-1', '后端名')).toBe('后端名')
    expect(activityDisplayName('a-1', '')).toBe('a-1')
    expect(activityDisplayName('a-1', null)).toBe('a-1')
  })
})