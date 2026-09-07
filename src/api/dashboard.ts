import http from './axios'

const BASE = '/rest/developer/server/hdkitservice/dashboard'

// ==================== Section 1: 业务核心指标 ====================

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

/** 新增用户月度趋势 */
export function getNewUserTrend() {
  return http.get(`${BASE}/developer/new-user-trend`)
}

/** npm 下载量趋势 */
export function getNpmDownloadTrend(days = 30) {
  return http.get(`${BASE}/npm/trend`, { params: { days } })
}

/** npm 下载概览 */
export function getNpmDownloadSummary() {
  return http.get(`${BASE}/npm/summary`)
}

/** 下载渠道汇总 */
export function getDownloadChannelSummary() {
  return http.get(`${BASE}/download/channel-summary`)
}

/** 下载渠道分布 */
export function getDownloadChannelDistribution() {
  return http.get(`${BASE}/download/channel-distribution`)
}

/** 下载趋势（GitHub + npm） */
export function getDownloadTrend(days = 30) {
  return http.get(`${BASE}/download/trend`, { params: { days } })
}

// ==================== Section 2: 开放能力 ====================

/** 开放能力汇总 */
export function getCapabilitySummary() {
  return http.get(`${BASE}/capability/summary`)
}

/** 开放能力趋势 */
export function getCapabilityTrend() {
  return http.get(`${BASE}/capability/trend`)
}

/** 开放能力分布 */
export function getCapabilityDistribution() {
  return http.get(`${BASE}/capability/distribution`)
}

/** Skill 排行 */
export function getSkillRanking() {
  return http.get(`${BASE}/capability/skill/ranking`)
}

// ==================== Section 4: 沙箱资源 ====================

/** 沙箱汇总 */
export function getSandboxSummary() {
  return http.get(`${BASE}/sandbox/summary`)
}

/** 沙箱趋势 */
export function getSandboxTrend() {
  return http.get(`${BASE}/sandbox/trend`)
}

/** 沙箱耗时分布 */
export function getSandboxDuration() {
  return http.get(`${BASE}/sandbox/duration`)
}

/** 沙箱每小时统计 */
export function getSandboxHourly() {
  return http.get(`${BASE}/sandbox/hourly`)
}

// ==================== Section 5: 代金券资源 ====================

/** 代金券汇总 */
export function getVoucherSummary() {
  return http.get(`${BASE}/voucher/summary`)
}

/** 代金券趋势 */
export function getVoucherTrend() {
  return http.get(`${BASE}/voucher/trend`)
}

/** 代金券面额分布 */
export function getVoucherDistribution() {
  return http.get(`${BASE}/voucher/distribution`)
}

// ==================== Section 6: 活动统计 ====================

/** 活动汇总 */
export function getActivitySummary() {
  return http.get(`${BASE}/activity/summary`)
}

/** 活动趋势 */
export function getActivityTrend() {
  return http.get(`${BASE}/activity/trend`)
}

/** 活动转化率 */
export function getActivityConversion() {
  return http.get(`${BASE}/activity/conversion`)
}
