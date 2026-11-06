import http from './axios'

const BASE = '/rest/developer/server/hdkitservice/dashboard'

/** 数据口径：yesterday（默认 T-1）/ realtime（当天实时） */
export type DateRange = 'yesterday' | 'realtime'

/** 当前实时刷新/聚合间隔（分钟），来自后台动态配置 */
export function getRealtimeInterval() {
  return http.get(`${BASE}/realtime/interval`)
}

type DateRangeParam = DateRange | undefined

/** 开发者概览 KPI */
export function getDeveloperSummary(dateRange?: DateRange) {
  return http.get(`${BASE}/developer/summary`, { params: { dateRange } })
}

/** DAU/MAU 趋势 */
export function getDeveloperTrend(days = 30, dateRange?: DateRangeParam) {
  return http.get(`${BASE}/developer/trend`, { params: { days, dateRange } })
}

/** Agent 接入分布 */
export function getAgentDistribution() {
  return http.get(`${BASE}/agent/distribution`)
}

/** devkit 客户端版本分布（按 plugin_version 去重用户） */
export function getVersionDistribution(dateRange?: DateRangeParam) {
  return http.get(`${BASE}/version/distribution`, { params: { dateRange } })
}

/** 新增用户趋势（近6个月环比/同比） */
export function getNewUserTrend() {
  return http.get(`${BASE}/developer/new-user-trend`)
}

/** 插件下载量趋势（GitHub + npm） */
export function getDownloadTrend(days = 30, dateRange?: DateRangeParam) {
  return http.get(`${BASE}/download/trend`, { params: { days, dateRange } })
}

/** 下载渠道总量（npm / GitHub） */
export function getDownloadChannelSummary() {
  return http.get(`${BASE}/download/channel-summary`)
}

/** 下载渠道占比分布 */
export function getDownloadChannelDistribution() {
  return http.get(`${BASE}/download/channel-distribution`)
}

// ======================== 开放能力 ========================

/** 开放能力概览 KPI */
export function getCapabilitySummary(dateRange?: DateRange) {
  return http.get(`${BASE}/capability/summary`, { params: { dateRange } })
}

/** 开放能力调用趋势 */
export function getCapabilityTrend(days = 14, dateRange?: DateRangeParam) {
  return http.get(`${BASE}/capability/trend`, { params: { days, dateRange } })
}

/** 开放能力分布 */
export function getCapabilityDistribution(dateRange?: DateRange) {
  return http.get(`${BASE}/capability/distribution`, { params: { dateRange } })
}

/** Skill 调用排行 */
export function getSkillRanking(limit = 10, dateRange?: DateRangeParam) {
  return http.get(`${BASE}/capability/skill/ranking`, { params: { limit, dateRange } })
}

// ======================== 沙箱资源信息 ========================

/** 沙箱资源概览 KPI */
export function getSandboxSummary(dateRange?: DateRange) {
  return http.get(`${BASE}/sandbox/summary`, { params: { dateRange } })
}

/** 沙箱拉取趋势 */
export function getSandboxTrend(dateRange?: DateRange) {
  return http.get(`${BASE}/sandbox/trend`, { params: { dateRange } })
}

/** 沙箱创建耗时分布 */
export function getSandboxDuration(dateRange?: DateRange) {
  return http.get(`${BASE}/sandbox/duration`, { params: { dateRange } })
}

/** 每小时沙箱拉取统计 */
export function getSandboxHourly(dateRange?: DateRange) {
  return http.get(`${BASE}/sandbox/hourly`, { params: { dateRange } })
}

// ======================== 沙箱观测（Issue #134，#121 后端已上线） ========================
// 固定近 30 天窗口、只读，不接受 dateRange 参数（与后端 /sandbox/revisit-interval 等 4 个端点口径一致）

/** 同 dev_stage_id 相邻成功 connect 事件间隔分布（6 桶 + p50/p90） */
export function getSandboxRevisitInterval() {
  return http.get(`${BASE}/sandbox/revisit-interval`)
}

/** 去重 dev_stage_id 闲置时长分布 + 超阈计数（idleThresholdHours 默认 24/72） */
export function getSandboxIdle(idleThresholdHours?: number[]) {
  return http.get(`${BASE}/sandbox/idle`, { params: { idleThresholdHours } })
}

/** connect 失败率 / error_code Top10 / 慢建连 Top10 / 逐日成功率趋势 */
export function getSandboxErrorStats() {
  return http.get(`${BASE}/sandbox/error-stats`)
}

/** action='create' 按 (template_id, flavor_id) 分组成本拆解 */
export function getSandboxCostBreakdown() {
  return http.get(`${BASE}/sandbox/cost-breakdown`)
}

// ======================== 代金券资源 ========================

/** 代金券总览 KPI */
export function getVoucherSummary(dateRange?: DateRange) {
  return http.get(`${BASE}/voucher/summary`, { params: { dateRange } })
}

/** 代金券领取趋势 */
export function getVoucherTrend(dateRange?: DateRange) {
  return http.get(`${BASE}/voucher/trend`, { params: { dateRange } })
}

/** 代金券面额分布 */
export function getVoucherDistribution(dateRange?: DateRange) {
  return http.get(`${BASE}/voucher/distribution`, { params: { dateRange } })
}

// ======================== 活动统计 ========================

// Issue #119 起：活动统计迁移至 src/api/activity.ts（/activity/stats 聚合端点
// + /activity/list 活动自动发现），本文件不再承载活动统计接口。

// ======================== 插件开源运营 ========================

/** 开源运营 KPI + Star 趋势（下载量趋势为 npm 口径） */
export function getOpenSourceSummary() {
  return http.get(`${BASE}/opensource/summary`)
}

/** 版本发布历史（downloadCount 为 npm 发布期间累计，近似口径） */
export function getOpenSourceReleases() {
  return http.get(`${BASE}/opensource/releases`)
}
/** 贡献者活跃（近 3 个月） */
export function getOpenSourceContributors() {
  return http.get(`${BASE}/opensource/contributors`)
}

// ==================== 服务健康（#120） ====================

/** 入站 API 健康概览（调用量/错误率/5xx 数，今日/昨日） */
export function getHealthSummary() {
  return http.get(`${BASE}/health/summary`)
}

/** 错误码 Top + 5xx path Top（带最近 traceId/时间） */
export function getHealthErrorTop() {
  return http.get(`${BASE}/health/error-top`)
}

/** 慢接口 Top（p90/95/99 分 path/host） */
export function getHealthSlowTop() {
  return http.get(`${BASE}/health/slow-top`)
}

/** 近 7 天错误率/调用量趋势 */
export function getHealthTrend() {
  return http.get(`${BASE}/health/trend`)
}
