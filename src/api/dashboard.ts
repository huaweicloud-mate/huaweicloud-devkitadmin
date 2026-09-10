import http from './axios'

const BASE = '/rest/developer/server/hdkitservice/dashboard'

/** 开发者概览 KPI */
export function getDeveloperSummary() {
  return http.get(`${BASE}/developer/summary`)
}

/** DAU/MAU 趋势 */
export function getDeveloperTrend(days = 30) {
  return http.get(`${BASE}/developer/trend`, { params: { days } })
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
export function getDownloadTrend(days = 30) {
  return http.get(`${BASE}/download/trend`, { params: { days } })
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
export function getCapabilitySummary() {
  return http.get(`${BASE}/capability/summary`)
}

/** 开放能力调用趋势 */
export function getCapabilityTrend(days = 14) {
  return http.get(`${BASE}/capability/trend`, { params: { days } })
}

/** 开放能力分布 */
export function getCapabilityDistribution() {
  return http.get(`${BASE}/capability/distribution`)
}

/** Skill 调用排行 */
export function getSkillRanking(limit = 10) {
  return http.get(`${BASE}/capability/skill/ranking`, { params: { limit } })
}

// ======================== 沙箱资源信息 ========================

/** 沙箱资源概览 KPI */
export function getSandboxSummary() {
  return http.get(`${BASE}/sandbox/summary`)
}

/** 沙箱拉取趋势 */
export function getSandboxTrend() {
  return http.get(`${BASE}/sandbox/trend`)
}

/** 沙箱创建耗时分布 */
export function getSandboxDuration() {
  return http.get(`${BASE}/sandbox/duration`)
}

/** 每小时沙箱拉取统计 */
export function getSandboxHourly() {
  return http.get(`${BASE}/sandbox/hourly`)
}

// ======================== 代金券资源 ========================

/** 代金券总览 KPI */
export function getVoucherSummary() {
  return http.get(`${BASE}/voucher/summary`)
}

/** 代金券领取趋势 */
export function getVoucherTrend() {
  return http.get(`${BASE}/voucher/trend`)
}

/** 代金券面额分布 */
export function getVoucherDistribution() {
  return http.get(`${BASE}/voucher/distribution`)
}

// ======================== 活动统计 ========================

/** 活动总览 KPI + 漏斗 */
export function getActivitySummary() {
  return http.get(`${BASE}/activity/summary`)
}

/** 活动完成趋势 */
export function getActivityTrend() {
  return http.get(`${BASE}/activity/trend`)
}

/** 活动转化率 */
export function getActivityConversion() {
  return http.get(`${BASE}/activity/conversion`)
}
