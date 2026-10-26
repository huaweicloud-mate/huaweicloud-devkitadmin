/**
 * 活动清单配置（前端配置化）
 *
 * 新增活动只需在此追加一条配置，看板即可展示，无需后端发版：
 * 后端统一聚合端点 GET /activity/stats?activity_code=xxx 对活动码通用查询。
 */
export interface ActivityConfig {
  /** 活动编码（与后端 activity_stats_snapshot.activity_code 对应） */
  code: string
  /** 活动展示名 */
  name: string
  /** 三个章节的展示标签（漏斗/趋势/转化图共用） */
  chapterLabels: [string, string, string]
  /** 活动说明（可选） */
  description?: string
}

/** 活动清单：新增活动在此追加一条即可 */
export const ACTIVITY_LIST: ActivityConfig[] = [
  {
    code: 'open-capability-2026-1024',
    name: '开放能力实战 1024 活动',
    chapterLabels: ['初章完成', '进阶章完成', '终章完成'],
    description: '参与 → 初章完成 → 进阶章完成 → 终章完成',
  },
]

/** 校验活动配置：activity_code 必须唯一，避免看板选择歧义 */
export function assertUniqueActivityCodes(list: ActivityConfig[]): void {
  const seen = new Set<string>()
  for (const a of list) {
    if (seen.has(a.code)) {
      throw new Error(`duplicate activity_code in activity-config: ${a.code}`)
    }
    seen.add(a.code)
  }
}

// 模块加载时校验默认清单，尽早暴露配置错误
assertUniqueActivityCodes(ACTIVITY_LIST)

/** 按活动编码查找配置（未配置返回 undefined，由调用方兜底） */
export function getActivityConfig(code: string, list: ActivityConfig[] = ACTIVITY_LIST): ActivityConfig | undefined {
  return list.find(a => a.code === code)
}
