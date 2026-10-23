import http from './axios'

const BASE = '/rest/developer/server/hdkitservice/dashboard'

/** 数据口径：yesterday（默认 T-1）/ realtime（当天实时） */
export type DateRange = 'yesterday' | 'realtime'

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

/** 活动编码（活动统计口径） */
const ACTIVITY_CODE = 'open-capability-2026-1024'

/** 活动总览 KPI + 漏斗 */
export function getActivitySummary(dateRange?: DateRange) {
  return http.get(`${BASE}/activity/summary`, { params: { activity_code: ACTIVITY_CODE, dateRange } })
}

/** 活动完成趋势 */
export function getActivityTrend(dateRange?: DateRange) {
  return http.get(`${BASE}/activity/trend`, { params: { activity_code: ACTIVITY_CODE, dateRange } })
}

/** 活动转化率 */
export function getActivityConversion(dateRange?: DateRange) {
  return http.get(`${BASE}/activity/conversion`, { params: { activity_code: ACTIVITY_CODE, dateRange } })
}

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
