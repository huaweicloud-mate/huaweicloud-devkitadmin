/**
 * Issue #119 活动配置覆盖：仅做名称/文案覆盖，不做活动清单（活动由后端
 * /activity/list 自动发现，新活动有数据即出现，前端零改动）。
 * 兼容保留 #39 的章节标签覆盖（未配置活动走默认标签）。
 */

/** 「全部活动·汇总」虚拟选项文案 */
export const ALL_ACTIVITY_LABEL = '全部活动·汇总'

/** 空列表/无最近快照时间时的兜底勾选：全部活动·汇总 */
export const ALL_ACTIVITY_CODE = '__all__'

/** 活动名称覆盖表（code → 展示名），未命中时用后端返回的 name */
export const ACTIVITY_NAME_OVERRIDES: Record<string, string> = {
  // 'open-capability-2026-1024': '开放能力实战 1024 活动',
}

/** KPI 汇总行口径标注（跨活动求和，同人可能重复计数） */
export const MULTI_SUM_NOTE = '跨活动求和口径：同一用户参与多个活动会被重复计数，比率按汇总基数重算'

/** 取活动展示名：覆盖表优先，其次后端 name，兜底 code */
export function activityDisplayName(code: string, backendName?: string | null): string {
  return ACTIVITY_NAME_OVERRIDES[code] ?? (backendName && backendName.trim() ? backendName : code)
}
