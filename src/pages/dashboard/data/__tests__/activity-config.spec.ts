import { describe, it, expect } from 'vitest'
import {
  ACTIVITY_LIST,
  getActivityConfig,
  assertUniqueActivityCodes,
  type ActivityConfig,
} from '../activity-config'

describe('activity-config', () => {
  it('has at least one activity configured', () => {
    expect(ACTIVITY_LIST.length).toBeGreaterThanOrEqual(1)
  })

  it('every activity has a non-empty code and name', () => {
    for (const a of ACTIVITY_LIST) {
      expect(a.code.length).toBeGreaterThan(0)
      expect(a.name.length).toBeGreaterThan(0)
      expect(a.chapterLabels).toHaveLength(3)
    }
  })

  it('default activity codes are unique (no duplicate config entries)', () => {
    expect(() => assertUniqueActivityCodes(ACTIVITY_LIST)).not.toThrow()
  })

  it('assertUniqueActivityCodes throws on duplicate codes', () => {
    const dup: ActivityConfig[] = [
      { code: 'a-1024', name: 'A', chapterLabels: ['初章', '进阶章', '终章'] },
      { code: 'a-1024', name: 'A2', chapterLabels: ['初章', '进阶章', '终章'] },
    ]
    expect(() => assertUniqueActivityCodes(dup)).toThrow(/duplicate/i)
  })

  it('getActivityConfig finds configured activity by code', () => {
    const first = ACTIVITY_LIST[0]
    expect(getActivityConfig(first.code)?.name).toBe(first.name)
  })

  it('getActivityConfig returns undefined for unknown code', () => {
    expect(getActivityConfig('no-such-activity')).toBeUndefined()
  })

  it('adding a new activity only requires one config entry', () => {
    const extended = [
      ...ACTIVITY_LIST,
      { code: 'new-activity-2099', name: '新活动', chapterLabels: ['一', '二', '三'] },
    ]
    expect(getActivityConfig('new-activity-2099', extended)?.name).toBe('新活动')
    expect(() => assertUniqueActivityCodes(extended)).not.toThrow()
  })
})
