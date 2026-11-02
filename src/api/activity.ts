import http from './axios'

const BASE = '/rest/developer/server/hdkitservice/dashboard'

// ======================== 活动统计（Issue #119 多选对比） ========================

/** /activity/list 活动自动发现列表项 */
export interface ActivityListItem {
  code: string
  name: string
  latest_snapshot_date: string | null
}

/** 活动统计三段（与后端 DTO 对齐） */
export interface ActivitySummary {
  totalParticipants: number
  chapter1Completed: number
  chapter2Completed: number
  chapter3Completed: number
  chapter1Rate: number
  chapter2Rate: number
  chapter3Rate: number
  funnel: Array<{ name: string; value: number; rate: number }>
}

export interface ActivityTrendPoint {
  date: string
  value: number
}

export interface ActivityTrend {
  chapter1: ActivityTrendPoint[]
  chapter2: ActivityTrendPoint[]
  chapter3: ActivityTrendPoint[]
}

export interface ActivityConversion {
  stages: Array<{ label: string; rate: number }>
}

/** /activity/stats 单活动项 */
export interface ActivityStatsItem {
  code: string
  name: string
  summary: ActivitySummary | null
  trend: ActivityTrend | null
  conversion: ActivityConversion | null
}

/** /activity/stats 多选对比响应：all = 跨活动求和汇总（比率按汇总基数重算） */
export interface ActivityStatsMulti {
  all: {
    summary: ActivitySummary | null
    trend: ActivityTrend | null
    conversion: ActivityConversion | null
  }
  items: ActivityStatsItem[]
}

/** 活动列表：distinct activity_code 按 MAX(snapshot_date) 降序（后端自动发现） */
export function getActivityList() {
  return http.get(`${BASE}/activity/list`)
}

/**
 * 活动统计多选对比：codes 为空数组/undefined 时不传 activity_code（=全部活动）；
 * 多码以重复参数 activity_code=A&activity_code=B 下发。
 */
export function getActivityStats(codes?: string[]): Promise<ActivityStatsMulti> {
  let url = `${BASE}/activity/stats`
  if (codes && codes.length > 0) {
    const params = new URLSearchParams()
    for (const code of codes) {
      params.append('activity_code', code)
    }
    url = `${url}?${params.toString()}`
  }
  return http.get(url) as Promise<ActivityStatsMulti>
}
