import http from './axios'

const BASE = '/rest/developer/server/dashboard/metrics'

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

/** npm 下载量趋势 */
export function getNpmDownloadTrend(days = 30) {
  return http.get(`${BASE}/npm/trend`, { params: { days } })
}

/** npm 下载概览 */
export function getNpmDownloadSummary() {
  return http.get(`${BASE}/npm/summary`)
}
