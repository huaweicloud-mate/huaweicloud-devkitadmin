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

/** 下载量趋势 */
export function getNpmDownloadTrend(days = 30) {
  return http.get(`${BASE}/download/trend`, { params: { days } })
}

/** 下载概览 */
export function getNpmDownloadSummary() {
  return http.get(`${BASE}/download/summary`)
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
