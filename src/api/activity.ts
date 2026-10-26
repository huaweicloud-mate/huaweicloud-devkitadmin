import http from './axios'

const BASE = '/rest/developer/server/hdkitservice/dashboard'

/** 活动统计数据段类型（统一聚合端点按类型命名的返回字段） */
export type ActivityStatsType = 'summary' | 'trend' | 'conversion'

export const ACTIVITY_STATS_TYPES: ActivityStatsType[] = ['summary', 'trend', 'conversion']

/** 聚合端点返回结构（按类型命名字段；types 裁剪后未请求的段为 undefined） */
export interface ActivityStats {
  summary?: {
    totalParticipants: number
    chapter1Completed: number
    chapter2Completed: number
    chapter3Completed: number
    chapter1Rate: number
    chapter2Rate: number
    chapter3Rate: number
    funnel: Array<{ name: string; value: number; rate: number }>
  }
  trend?: {
    chapter1: Array<{ date: string; value: number }>
    chapter2: Array<{ date: string; value: number }>
    chapter3: Array<{ date: string; value: number }>
  }
  conversion?: {
    stages: Array<{ label: string; rate: number }>
  }
}

/** 构造 GET /activity/stats 查询参数（纯函数，便于测试） */
export function buildActivityStatsParams(
  activityCode: string,
  types?: ActivityStatsType[],
): Record<string, string> {
  const params: Record<string, string> = { activity_code: activityCode }
  if (types && types.length > 0) {
    params.types = types.join(',')
  }
  return params
}

/**
 * 统一活动统计聚合端点：一次请求返回 { summary, trend, conversion }，
 * types 可选裁剪返回段。新增活动仅需前端配置 activity_code，后端零发版。
 */
export function getActivityStats(activityCode: string, types?: ActivityStatsType[]) {
  return http.get(`${BASE}/activity/stats`, { params: buildActivityStatsParams(activityCode, types) })
}
