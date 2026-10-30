import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/dashboard'
import * as activityApi from '@/api/activity'
import type { DateRange } from '@/api/dashboard'
import { ACTIVITY_LIST, getActivityConfig } from '@/pages/dashboard/data/activity-config'

export interface DeveloperSummary {
  totalDevelopers: number
  newUsersThisMonth: number
  newUsersGrowthRate: number
  dau: number
  mau: number
  agentTotal: number
}

export interface DauTrendItem {
  date: string
  dau: number
  mau: number
}

export interface AgentDistributionItem {
  name: string
  count: number
}

export interface VersionDistributionItem {
  version: string
  count: number
  percentage: number
}

export interface NewUserTrendItem {
  month: string
  newUserCount: number
  momRate: number | null
  yoyRate: number | null
}

export interface DownloadChannelItem {
  channel: string
  count: number
  percentage: number
}

export interface DownloadTrendItem {
  date: string
  npmDownloads: number
  githubDownloads: number | null
}

export interface DownloadChannelSummary {
  totalDownloads: number
  githubDownloads: number
  npmDownloads: number
}

export interface CapabilitySummary {
  totalCalls: number
  uniqueUsers: number
  dailyAvgCalls: number
  todayCalls: number
  skillCalls: number
  mcpCalls: number
}

export interface CapabilityTrendItem {
  date: string
  capability: string
  callCount: number
}

export interface CapabilityDistributionItem {
  capability: string
  callCount: number
  percentage: number
}

export interface SkillRankingItem {
  rank: number
  skillName: string
  callCount: number
  percentage: number
}

export interface OpenSourceSummary {
  stars: number
  forks: number
  watchers: number
  openIssues: number
  commits: number
  releases: number
  openPrs: number
  latestVersion: string | null
  latestReleaseDate: string | null
  starTrend: OpenSourceTrendItem[]
  downloadTrend: OpenSourceDownloadTrendItem[]
}

export interface OpenSourceTrendItem {
  date: string
  stars: number
}

export interface OpenSourceDownloadTrendItem {
  date: string
  downloads: number
  source?: string
}

export interface OpenSourceContributorItem {
  author: string
  commits: number
  prs: number
  issues: number
}
export interface OpenSourceReleaseItem {
  tagName: string
  name: string
  publishedDate: string
  downloadCount: number | null
  downloadSource?: string
}

export interface SandboxSummary {
  totalUsers: number
  dailyUsers: number
  dailyUsersChainRatio: number
  avgDurationSec: number
  avgDurationDeltaSec: number
  slaTarget: string
}

export interface SandboxTrendPoint {
  date: string
  value: number
}

export interface SandboxTrend {
  daily: SandboxTrendPoint[]
  events: SandboxTrendPoint[]
  totalUsers: number
}

export interface SandboxDurationBucket {
  label: string
  order: number
  count: number
}

export interface SandboxDuration {
  statDate: string
  buckets: SandboxDurationBucket[]
}

export interface SandboxHourlyPoint {
  hour: number
  count: number
}

export interface SandboxHourly {
  statDate: string
  hourly: SandboxHourlyPoint[]
}

export interface VoucherSummary {
  totalCount: number
  totalAmount: number
  yesterdayCount: number
  yesterdayAmount: number
  yesterdayCountChainRatio: number
  yesterdayAmountChainRatio: number
  monthCount: number
  monthAmount: number
  monthCountChainRatio: number
  monthAmountChainRatio: number
}

export interface VoucherTrendPoint {
  date: string
  count: number
  amount: number
}

export interface VoucherTrend {
  daily: VoucherTrendPoint[]
}

export interface VoucherFaceValueItem {
  faceAmount: number
  claimCount: number
  percentage: number
}

export interface VoucherDistribution {
  items: VoucherFaceValueItem[]
}

/** 分 → 元，返回带千分位的字符串 */
export function fmtYuan(cents: number | undefined | null): string {
  if (cents == null) return '--'
  return (cents / 100).toLocaleString()
}

/** 分 → 元，返回带 ¥ 前缀的字符串 */
export function fmtYuanWithSymbol(cents: number | undefined | null): string {
  if (cents == null) return '¥--'
  return '¥' + (cents / 100).toLocaleString()
}

export interface ActivityFunnelStage {
  name: string
  value: number
  rate: number
}

export interface ActivitySummary {
  totalParticipants: number
  chapter1Completed: number
  chapter2Completed: number
  chapter3Completed: number
  chapter1Rate: number
  chapter2Rate: number
  chapter3Rate: number
  funnel: ActivityFunnelStage[]
}

export interface ActivityTrendPoint {
  date: string
  value: number
}

export interface ActivityTrend {
  chapter1: ActivityTrendPoint[]
  chapter2: ActivityTrendPoint[]
  chapter3: ActivityTrendPoint[]
}

export interface ActivityConvItem {
  label: string
  rate: number
}

export interface ActivityConversion {
  stages: ActivityConvItem[]
}

export const useDashboardStore = defineStore('dashboard', () => {
  const developerSummary = ref<DeveloperSummary | null>(null)
  const dauTrend = ref<DauTrendItem[]>([])
  const agentDistribution = ref<AgentDistributionItem[]>([])
  const versionDistribution = ref<VersionDistributionItem[]>([])
  const newUserTrend = ref<NewUserTrendItem[]>([])
  const downloadChannelDist = ref<DownloadChannelItem[]>([])
  const downloadTrend = ref<DownloadTrendItem[]>([])
  const downloadChannelSummary = ref<DownloadChannelSummary | null>(null)
  const capabilitySummary = ref<CapabilitySummary | null>(null)
  const capabilityTrend = ref<CapabilityTrendItem[]>([])
  const capabilityDistribution = ref<CapabilityDistributionItem[]>([])
  const skillRanking = ref<SkillRankingItem[]>([])
  const sandboxSummary = ref<SandboxSummary | null>(null)
  const sandboxTrend = ref<SandboxTrend | null>(null)
  const sandboxDuration = ref<SandboxDuration | null>(null)
  const sandboxHourly = ref<SandboxHourly | null>(null)
  const voucherSummary = ref<VoucherSummary | null>(null)
  const voucherTrend = ref<VoucherTrend | null>(null)
  const voucherDistribution = ref<VoucherDistribution | null>(null)
  const activitySummary = ref<ActivitySummary | null>(null)
  const activityTrend = ref<ActivityTrend | null>(null)
  const activityConversion = ref<ActivityConversion | null>(null)
  /** 活动清单（前端配置化，新增活动无需后端发版） */
  const activities = ACTIVITY_LIST
  /** 当前选中的活动编码 */
  const selectedActivityCode = ref<string>(ACTIVITY_LIST[0]?.code ?? '')

  const openSourceSummary = ref<OpenSourceSummary | null>(null)
  const openSourceReleases = ref<OpenSourceReleaseItem[]>([])
  const openSourceContributors = ref<OpenSourceContributorItem[]>([])
  const openSourceError = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /** 数据口径：yesterday（默认 T-1）/ realtime（当天实时） */
  const dateRange = ref<DateRange>('yesterday')
  /** 实时口径下后台返回的数据计算时间戳（缓存截止上次计算时刻） */
  const computedAt = ref<string | null>(null)
  const realtimeError = ref<string | null>(null)

  /** 实时自动刷新间隔（分钟），取自后台动态配置，失败兜底 5 */
  const refreshIntervalMinutes = ref(5)
  let autoRefreshTimer: ReturnType<typeof setInterval> | null = null
  /** 代次计数器：stopAutoRefresh 时自增；in-flight 的 startAutoRefresh 在 await 后检测代次变化即放弃重排 */
  let autoRefreshEpoch = 0

  /** 停止实时自动刷新定时器（同时使所有 in-flight 的 startAutoRefresh 失效） */
  function stopAutoRefresh() {
    autoRefreshEpoch++
    if (autoRefreshTimer != null) {
      clearInterval(autoRefreshTimer)
      autoRefreshTimer = null
    }
  }

  /** 启动实时自动刷新：间隔取后台动态配置，失败兜底 5 分钟 */
  async function startAutoRefresh() {
    stopAutoRefresh()
    const epoch = autoRefreshEpoch
    try {
      const raw: any = await api.getRealtimeInterval()
      const n = Number(raw?.intervalMinutes)
      refreshIntervalMinutes.value = Number.isFinite(n) && n >= 1 && n <= 60 ? n : 5
    } catch {
      refreshIntervalMinutes.value = 5
    }
    // 等待配置期间如果已停止（切回 T-1 / 卸载 / 二次启动），代次已变化则放弃重排
    if (autoRefreshEpoch !== epoch || dateRange.value !== 'realtime') return
    autoRefreshTimer = setInterval(() => {
      loadBusinessMetrics()
    }, refreshIntervalMinutes.value * 60_000)
  }

  const isRealtime = () => dateRange.value === 'realtime'

  /**
   * 实时口径响应解包：后台 dateRange=realtime 时返回 { dateRange, computedAt, data } 包装；
   * T-1 口径返回原始 DTO（结构不变）。解包同时记录数据计算时间戳。
   */
  function unwrapRealtime(raw: any): any {
    if (raw && typeof raw === 'object' && raw.dateRange === 'realtime' && 'data' in raw) {
      computedAt.value = raw.computedAt ?? null
      return raw.data
    }
    return raw
  }

  /** 切换数据口径（前一天 / 当天实时）：实时口径启动自动刷新，T-1 口径停止 */
  async function setDateRange(range: DateRange) {
    if (dateRange.value === range) return
    dateRange.value = range
    if (range === 'realtime') {
      computedAt.value = null
      await startAutoRefresh()
      await loadBusinessMetrics()
    } else {
      stopAutoRefresh()
      computedAt.value = null
      await loadBusinessMetrics()
    }
  }

  async function loadDeveloperSummary() {
    const raw: any = unwrapRealtime(await api.getDeveloperSummary(dateRange.value))
    developerSummary.value = {
      totalDevelopers: raw.totalDevelopers ?? 0,
      newUsersThisMonth: raw.newUsersToday ?? 0,
      newUsersGrowthRate: raw.newUsersChainRatio ?? 0,
      dau: raw.dau ?? 0,
      mau: raw.mau ?? 0,
      agentTotal: raw.agentTotal ?? 0,
    }
  }

  async function loadDauTrend(days = 30) {
    const raw: any = unwrapRealtime(await api.getDeveloperTrend(days, dateRange.value))
    dauTrend.value = raw?.points ?? raw ?? []
  }

  async function loadAgentDistribution() {
    const raw: any = await api.getAgentDistribution()
    agentDistribution.value = raw?.agents ?? raw ?? []
  }

  async function loadVersionDistribution() {
    const raw: any = await api.getVersionDistribution()
    versionDistribution.value = raw?.versions ?? raw?.data?.versions ?? []
  }

  async function loadNewUserTrend() {
    const raw: any = await api.getNewUserTrend()
    newUserTrend.value = raw?.months ?? raw ?? []
  }

  async function loadDownloadChannelDist() {
    const raw: any = await api.getDownloadChannelDistribution()
    downloadChannelDist.value = raw?.channels ?? raw ?? []
  }

  async function loadDownloadTrend(days = 30) {
    const raw: any = unwrapRealtime(await api.getDownloadTrend(days, dateRange.value))
    const npmDaily: Array<{ date: string; downloads: number }> = raw?.npmDaily ?? []
    const githubDaily: Array<{ date: string; downloads: number }> = raw?.githubDaily ?? []
    const githubMap = new Map(githubDaily.map(p => [p.date, p.downloads]))
    const dates = new Set([...npmDaily.map(p => p.date), ...githubDaily.map(p => p.date)])
    downloadTrend.value = [...dates].sort().map(date => ({
      date,
      npmDownloads: npmDaily.find(p => p.date === date)?.downloads ?? 0,
      githubDownloads: githubMap.get(date) ?? null,
    }))
  }

  async function loadDownloadChannelSummary() {
    const raw: any = await api.getDownloadChannelSummary()
    downloadChannelSummary.value = {
      totalDownloads: raw.totalDownloads ?? 0,
      githubDownloads: raw.githubDownloads ?? 0,
      npmDownloads: raw.npmDownloads ?? 0,
    }
  }

  async function loadCapabilitySummary() {
    const data: any = unwrapRealtime(await api.getCapabilitySummary(dateRange.value))
    capabilitySummary.value = data
  }

  async function loadCapabilityTrend(days = 14) {
    const raw: any = unwrapRealtime(await api.getCapabilityTrend(days, dateRange.value))
    if (raw?.dates && raw?.lines) {
      const flat: CapabilityTrendItem[] = []
      for (const line of raw.lines) {
        for (const [idx, count] of line.data) {
          flat.push({ date: raw.dates[idx], capability: line.capability, callCount: count })
        }
      }
      capabilityTrend.value = flat
    } else {
      capabilityTrend.value = raw ?? []
    }
  }

  async function loadCapabilityDistribution() {
    const raw: any = unwrapRealtime(await api.getCapabilityDistribution(dateRange.value))
    capabilityDistribution.value = raw?.capabilities ?? raw ?? []
  }

  async function loadSkillRanking(limit = 10) {
    const raw: any = unwrapRealtime(await api.getSkillRanking(limit, dateRange.value))
    skillRanking.value = raw?.skills ?? raw ?? []
  }

  async function loadSandboxSummary() {
    const data: any = unwrapRealtime(await api.getSandboxSummary(dateRange.value))
    sandboxSummary.value = data
  }

  async function loadSandboxTrend() {
    const raw: any = unwrapRealtime(await api.getSandboxTrend(dateRange.value))
    sandboxTrend.value = raw
  }

  async function loadSandboxDuration() {
    const raw: any = unwrapRealtime(await api.getSandboxDuration(dateRange.value))
    sandboxDuration.value = raw
  }

  async function loadSandboxHourly() {
    const raw: any = unwrapRealtime(await api.getSandboxHourly(dateRange.value))
    sandboxHourly.value = raw
  }

  async function loadVoucherSummary() {
    const data: any = unwrapRealtime(await api.getVoucherSummary(dateRange.value))
    voucherSummary.value = data
  }

  async function loadVoucherTrend() {
    const raw: any = unwrapRealtime(await api.getVoucherTrend(dateRange.value))
    voucherTrend.value = raw
  }

  async function loadVoucherDistribution() {
    const raw: any = unwrapRealtime(await api.getVoucherDistribution(dateRange.value))
    voucherDistribution.value = raw
  }

  /**
   * 统一活动统计聚合：一次调用 GET /activity/stats，
   * 按 summary / trend / conversion 命名字段分发到看板既有状态。
   */
  async function loadActivityStats() {
    const raw: any = unwrapRealtime(
      await activityApi.getActivityStats(selectedActivityCode.value),
    )
    activitySummary.value = raw?.summary ?? null
    activityTrend.value = raw?.trend ?? null
    activityConversion.value = raw?.conversion ?? null
  }

  /** 切换活动（配置驱动）：更新选中编码并重新加载该活动统计 */
  async function setActivityCode(code: string) {
    if (!getActivityConfig(code) || code === selectedActivityCode.value) return
    selectedActivityCode.value = code
    activitySummary.value = null
    activityTrend.value = null
    activityConversion.value = null
    await loadActivityStats()
  }

  async function loadOpenSource() {
    try {
      const [summary, releases, contributors] = await Promise.all([
        api.getOpenSourceSummary(),
        api.getOpenSourceReleases(),
        api.getOpenSourceContributors(),
      ]) as any[]
      // axios 拦截器已解包 response.data；后端趋势点字段为 value，归一化为模板使用的 stars/downloads
      openSourceSummary.value = {
        ...summary,
        starTrend: (summary.starTrend ?? []).map((p: any) => ({ date: p.date, stars: p.value })),
        downloadTrend: (summary.downloadTrend ?? []).map((p: any) => ({
          date: p.date,
          downloads: p.value,
          source: summary.downloadTrendSource ?? 'npm',
        })),
      }
      openSourceReleases.value = (releases.releases ?? []).map((r: any) => ({
        ...r,
        downloadSource: r.downloadSource ?? 'npm',
      }))
      openSourceContributors.value = contributors.contributors ?? []
    } catch (e: any) {
      openSourceError.value = e.message || 'Failed to load opensource metrics'
    }
  }

  async function loadBusinessMetrics() {
    loading.value = true
    error.value = null
    realtimeError.value = null
    try {
      await Promise.all([
        loadDeveloperSummary(),
        loadDauTrend(),
        loadAgentDistribution(),
        loadVersionDistribution(),
        loadNewUserTrend(),
        loadDownloadChannelSummary(),
        loadDownloadChannelDist(),
        loadDownloadTrend(),
        loadCapabilitySummary(),
        loadCapabilityTrend(),
        loadCapabilityDistribution(),
        loadSkillRanking(),
        loadSandboxSummary(),
        loadSandboxTrend(),
        loadSandboxDuration(),
        loadSandboxHourly(),
        loadVoucherSummary(),
        loadVoucherTrend(),
        loadVoucherDistribution(),
        loadActivityStats(),
        loadOpenSource(),
      ])
    } catch (e: any) {
      error.value = e.message || 'Failed to load metrics'
      if (isRealtime()) {
        realtimeError.value = '当天实时数据加载失败，请稍后重试或切换回「前一天」口径'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    developerSummary,
    dauTrend,
    agentDistribution,
    versionDistribution,
    newUserTrend,
    downloadChannelDist,
    downloadTrend,
    downloadChannelSummary,
    capabilitySummary,
    capabilityTrend,
    capabilityDistribution,
    skillRanking,
    sandboxSummary,
    sandboxTrend,
    sandboxDuration,
    sandboxHourly,
    voucherSummary,
    voucherTrend,
    voucherDistribution,
    activitySummary,
    activityTrend,
    activityConversion,
    activities,
    selectedActivityCode,
    setActivityCode,
    loadActivityStats,
    openSourceSummary,
    openSourceReleases,
    openSourceContributors,
    openSourceError,
    loading,
    error,
    dateRange,
    computedAt,
    realtimeError,
    refreshIntervalMinutes,
    startAutoRefresh,
    stopAutoRefresh,
    setDateRange,
    isRealtime,
    loadDeveloperSummary,
    loadDauTrend,
    loadAgentDistribution,
    loadVersionDistribution,
    loadNewUserTrend,
    loadDownloadChannelDist,
    loadDownloadTrend,
    loadDownloadChannelSummary,
    loadCapabilitySummary,
    loadCapabilityTrend,
    loadCapabilityDistribution,
    loadSkillRanking,
    loadSandboxSummary,
    loadSandboxTrend,
    loadSandboxDuration,
    loadSandboxHourly,
    loadVoucherSummary,
    loadVoucherTrend,
    loadVoucherDistribution,
    loadOpenSource,
    loadBusinessMetrics,
  }
})

