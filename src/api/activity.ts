import http from './axios'

const BASE = '/rest/developer/server/hdkitservice/dashboard'

// ======================== 活动统计（Issue #119 多选对比） ========================

/** /activity/list 活动自动发现列表项 */
export interface ActivityListItem {
  code: string
  name: string
  latest_snapshot_date: string | null
}

/** 活动单个阶段统计（阶段数量/名称随活动而变，后端配置驱动） */
export interface ActivityStageStat {
  key: string
  label: string
  value: number
  rate: number
}

/** 活动统计三段（与后端 DTO 对齐：动态阶段 stages） */
export interface ActivitySummary {
  totalParticipants: number
  stages: ActivityStageStat[]
}

export interface ActivityTrendPoint {
  date: string
  value: number
}

export interface ActivityStageTrend {
  key: string
  label: string
  points: ActivityTrendPoint[]
}

export interface ActivityTrend {
  stages: ActivityStageTrend[]
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

/** /activity/codes 活动登记表项（配置驱动，含无数据活动） */
export interface ActivityCodeItem {
  code: string
  name: string
}

/** 活动登记表：配置里登记的所有活动（含无快照数据的），最新在前 */
export function getActivityCodes(): Promise<ActivityCodeItem[]> {
  return http.get(`${BASE}/activity/codes`) as Promise<ActivityCodeItem[]>
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
