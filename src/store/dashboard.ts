import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '@/api/dashboard'
import * as activityApi from '@/api/activity'
import type { DateRange } from '@/api/dashboard'
import {
  ALL_ACTIVITY_CODE,
  activityDisplayName,
} from '@/pages/dashboard/data/activity-config'
import type {
  ActivityListItem,
  ActivityStatsItem,
  ActivityStatsMulti,
} from '@/api/activity'

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
  /** CLI 调用总次数（Issue #115 后端新增，#134 前端补齐） */
  cliCalls: number
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
  /** 平均拉起耗时（秒）；#113 起后端无数据时返回 null */
  avgDurationSec: number | null
  avgDurationDeltaSec: number | null
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

// ==================== 沙箱观测（Issue #134，对齐 hdkitservice #121 DTO） ====================

export interface SandboxRevisitBucket {
  label: string
  order: number
  count: number
}

/** 同 dev_stage_id 相邻成功 connect 事件间隔（connect 事件近似口径） */
export interface SandboxRevisitInterval {
  windowStart: string
  windowEnd: string
  p50Seconds: number | null
  p90Seconds: number | null
  buckets: SandboxRevisitBucket[]
  note: string
}

export interface SandboxIdleBucket {
  label: string
  order: number
  count: number
}

export interface SandboxIdleThreshold {
  thresholdHours: number
  count: number
}

/** 去重 dev_stage_id 闲置时长分布（用户最后使用时间，非实时状态） */
export interface SandboxIdle {
  windowStart: string
  windowEnd: string
  distinctDevStages: number
  buckets: SandboxIdleBucket[]
  thresholds: SandboxIdleThreshold[]
  note: string
}

export interface SandboxErrorCodeItem {
  errorCode: string
  count: number
}

export interface SandboxSlowConnect {
  devStageId: string
  durationMs: number | null
  errorCode: string | null
  createdAt: string | null
}

export interface SandboxDailyTrendPoint {
  date: string
  total: number
  success: number
  successRate: number
}

/** connect 失败率 / 错误码 Top10 / 慢建连 Top10 / 逐日成功率趋势 */
export interface SandboxErrorStats {
  windowStart: string
  windowEnd: string
  totalEvents: number
  failEvents: number
  failRate: number
  topErrorCodes: SandboxErrorCodeItem[]
  slowestConnects: SandboxSlowConnect[]
  dailyTrend: SandboxDailyTrendPoint[]
}

export interface SandboxCostItem {
  templateId: string
  flavorId: string
  createCount: number
  distinctUsers: number
}

/** action='create' 按 (template_id, flavor_id) 分组成本拆解 */
export interface SandboxCostBreakdown {
  windowStart: string
  windowEnd: string
  items: SandboxCostItem[]
  total: SandboxCostItem | null
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

export interface ActivityStageStat {
  key: string
  label: string
  value: number
  rate: number
}

export interface ActivitySummary {
  totalParticipants: number
  stages: ActivityStageStat[]
}

export interface ActivityTrendPoint {
  date: string
  value: number
}

export interface ActivityStageTrend {
  key: string
  label: string
  points: ActivityTrendPoint[]
}

export interface ActivityTrend {
  stages: ActivityStageTrend[]
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
  const sandboxRevisitInterval = ref<SandboxRevisitInterval | null>(null)
  const sandboxIdle = ref<SandboxIdle | null>(null)
  const sandboxErrorStats = ref<SandboxErrorStats | null>(null)
  const sandboxCostBreakdown = ref<SandboxCostBreakdown | null>(null)
  const voucherSummary = ref<VoucherSummary | null>(null)
  const voucherTrend = ref<VoucherTrend | null>(null)
  const voucherDistribution = ref<VoucherDistribution | null>(null)
  // ==================== 活动统计（Issue #119 多选对比 + 自动发现） ====================
  /** 后端自动发现的活动列表（按 MAX(snapshot_date) 降序） */
  const activityList = ref<ActivityListItem[]>([])
  /** 当前勾选的活动 code；含 ALL_ACTIVITY_CODE 表示「全部活动·汇总」 */
  const selectedActivityCodes = ref<string[]>([])
  /** /activity/stats 多选响应 */
  const activityStats = ref<ActivityStatsMulti | null>(null)
  const activityLoading = ref(false)

  /** 实际请求的活动码（不含虚拟全部项；空数组 = 全部活动） */
  const effectiveActivityCodes = computed(() =>
    selectedActivityCodes.value.filter(code => code !== ALL_ACTIVITY_CODE),
  )

  /** 是否多选（>1 个活动，或勾了「全部」且列表非空） */
  const isActivityMulti = computed(() => {
    if (selectedActivityCodes.value.includes(ALL_ACTIVITY_CODE)) {
      return activityList.value.length > 1
    }
    return selectedActivityCodes.value.length > 1
  })

  /** 各选中活动的统计项（勾「全部」= 列表内全部活动） */
  const selectedActivityItems = computed<ActivityStatsItem[]>(() => {
    if (!activityStats.value) return []
    if (selectedActivityCodes.value.includes(ALL_ACTIVITY_CODE)) {
      return activityStats.value.items
    }
    return activityStats.value.items.filter(item =>
      selectedActivityCodes.value.includes(item.code),
    )
  })

  // 兼容旧视图的单选展示 refs（由当前选中项填充；多选时取 all 汇总）
  const activitySummary = ref<ActivitySummary | null>(null)
  const activityTrend = ref<ActivityTrend | null>(null)
  const activityConversion = ref<ActivityConversion | null>(null)

  /** 活动下拉展示名（覆盖表优先） */
  function activityNameOf(code: string): string {
    if (code === ALL_ACTIVITY_CODE) return '全部活动·汇总'
    const item = activityList.value.find(a => a.code === code)
    return activityDisplayName(code, item?.name)
  }

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

  // 沙箱观测 4 接口为固定近 30 天窗口（无 dateRange 包装），直接赋值
  async function loadSandboxRevisitInterval() {
    const raw: any = await api.getSandboxRevisitInterval()
    sandboxRevisitInterval.value = raw
  }

  async function loadSandboxIdle() {
    const raw: any = await api.getSandboxIdle()
    sandboxIdle.value = raw
  }

  async function loadSandboxErrorStats() {
    const raw: any = await api.getSandboxErrorStats()
    sandboxErrorStats.value = raw
  }

  async function loadSandboxCostBreakdown() {
    const raw: any = await api.getSandboxCostBreakdown()
    sandboxCostBreakdown.value = raw
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

  /** 活动列表：接口发现 + activity-config 覆盖；默认勾选第一个（最新有数据活动） */
  async function loadActivityList() {
    const raw: any = await activityApi.getActivityList()
    const list: ActivityListItem[] = raw ?? []
    activityList.value = list.map(item => ({
      code: item.code,
      name: activityDisplayName(item.code, item.name),
      latest_snapshot_date: item.latest_snapshot_date ?? null,
    }))
  }

  /** 默认勾选：列表第一个；空列表/无最近快照时间兜底勾「全部活动·汇总」 */
  function applyDefaultActivitySelection() {
    const first = activityList.value.find(
      a => a.code && a.latest_snapshot_date,
    )
    selectedActivityCodes.value = first ? [first.code] : [ALL_ACTIVITY_CODE]
  }

  /** 拉取当前勾选活动的统计（空参=全部活动），并同步旧展示 refs */
  async function loadActivityStats() {
    activityLoading.value = true
    try {
      const codes = effectiveActivityCodes.value
      const data = unwrapRealtime(await activityApi.getActivityStats(codes))
      activityStats.value = data
      syncLegacyActivityRefs()
    } finally {
      activityLoading.value = false
    }
  }

  /** 单选时旧 refs 指向该活动数据；多选/全部时指向 all 汇总 */
  function syncLegacyActivityRefs() {
    const stats = activityStats.value
    if (!stats) return
    if (!isActivityMulti.value && effectiveActivityCodes.value.length === 1) {
      const item = stats.items.find(i => i.code === effectiveActivityCodes.value[0])
      activitySummary.value = item?.summary ?? stats.all.summary ?? null
      activityTrend.value = item?.trend ?? stats.all.trend ?? null
      activityConversion.value = item?.conversion ?? stats.all.conversion ?? null
    } else {
      activitySummary.value = stats.all.summary ?? null
      activityTrend.value = stats.all.trend ?? null
      activityConversion.value = stats.all.conversion ?? null
    }
  }

  /** 更新勾选（勾「全部」时忽略其它码）并重新拉取统计 */
  async function selectActivities(codes: string[]) {
    const normalized = codes.includes(ALL_ACTIVITY_CODE)
      ? [ALL_ACTIVITY_CODE]
      : codes.filter(c => c && c !== ALL_ACTIVITY_CODE)
    selectedActivityCodes.value = normalized
    await loadActivityStats()
  }

  /** 活动看板入口：发现列表 → 默认勾选 → 拉取统计 */
  async function loadActivityBoard() {
    try {
      await loadActivityList()
    } catch {
      activityList.value = []
    }
    applyDefaultActivitySelection()
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
        loadSandboxRevisitInterval(),
        loadSandboxIdle(),
        loadSandboxErrorStats(),
        loadSandboxCostBreakdown(),
        loadHealthSummary(),
        loadHealthErrorTop(),
        loadHealthSlowTop(),
        loadHealthTrend(),
        loadVoucherSummary(),
        loadVoucherTrend(),
        loadVoucherDistribution(),
        loadActivityBoard(),
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
    healthSummary,
    healthErrorTop,
    healthSlowTop,
    healthTrend,
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
    sandboxRevisitInterval,
    sandboxIdle,
    sandboxErrorStats,
    sandboxCostBreakdown,
    voucherSummary,
    voucherTrend,
    voucherDistribution,
    activitySummary,
    activityTrend,
    activityConversion,
    activityList,
    selectedActivityCodes,
    activityStats,
    activityLoading,
    isActivityMulti,
    selectedActivityItems,
    activityNameOf,
    loadActivityList,
    loadActivityStats,
    selectActivities,
    loadActivityBoard,
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
    loadSandboxRevisitInterval,
    loadSandboxIdle,
    loadSandboxErrorStats,
    loadSandboxCostBreakdown,
    loadVoucherSummary,
    loadVoucherTrend,
    loadVoucherDistribution,
    loadOpenSource,
    loadBusinessMetrics,
  }
})


// ==================== 服务健康（#120） ====================

export interface HealthSummaryDay {
  date: string
  totalCalls: number
  errorCalls: number
  errorRatePct: number
  serverErrorCalls: number
  slowCalls: number
}

export interface HealthSummaryUpstream {
  host: string
  totalCalls: number
  failedCalls: number
  failedRatePct: number
  avgDurationMs: number
}

export interface HealthSummary {
  yesterday: HealthSummaryDay
  today: HealthSummaryDay
  upstream: HealthSummaryUpstream[]
}

export interface HealthErrorItem {
  errorCode: string
  count: number
  recentTraceId: string
  recentTime: string
}

export interface HealthSlowItem {
  path: string
  host: string
  p90: number
  p95: number
  p99: number
}

export interface HealthTrendPoint {
  date: string
  totalCalls: number
  errorRate: number
}

const healthSummary = ref<HealthSummary | null>(null)
const healthErrorTop = ref<HealthErrorItem[]>([])
const healthSlowTop = ref<HealthSlowItem[]>([])
const healthTrend = ref<HealthTrendPoint[]>([])

async function loadHealthSummary() {
  try {
    const raw = await api.getHealthSummary() as any
    const d = raw?.data ?? raw
    // 后端返回 {yesterday, today, upstream}，校验结构后赋值
    if (d && d.yesterday && d.today) {
      healthSummary.value = d
    } else {
      healthSummary.value = null
    }
  } catch { healthSummary.value = null }
}

async function loadHealthErrorTop() {
  try {
    const raw = await api.getHealthErrorTop() as any
    const d = raw?.data ?? raw
    // 后端返回 {errorCodes: [{errorCode, count, latestTraceId, latestTime}], serverErrorPaths: [...], upstreamFailures: [...]}
    // 前端期望 Array<{errorCode, count}>
    if (d?.errorCodes) {
      healthErrorTop.value = d.errorCodes
    } else if (d?.upstreamFailures) {
      healthErrorTop.value = d.upstreamFailures.map((u: any) => ({
        errorCode: u.errorCode,
        count: u.count
      }))
    } else {
      healthErrorTop.value = []
    }
  } catch { healthErrorTop.value = [] }
}

async function loadHealthSlowTop() {
  try {
    const raw = await api.getHealthSlowTop() as any
    const d = raw?.data ?? raw
    // 后端返回 {inbound: [{path, samples, p90Ms, p95Ms, p99Ms, maxMs}], upstream: [...]}
    // 前端期望 Array<{path, host, p95}>
    if (d?.inbound) {
      healthSlowTop.value = d.inbound.map((p: any) => ({
        path: p.path,
        host: 'inbound',
        p95: p.p95Ms
      }))
    } else if (d?.upstream) {
      healthSlowTop.value = d.upstream.map((p: any) => ({
        path: p.host,
        host: p.host,
        p95: p.p95Ms
      }))
    } else {
      healthSlowTop.value = []
    }
  } catch { healthSlowTop.value = [] }
}

async function loadHealthTrend() {
  try {
    const raw = await api.getHealthTrend() as any
    const d = raw?.data ?? raw
    // 后端返回 {inbound: [{date, calls, errorCalls, errorRatePct}], upstream: [...]}
    // 前端期望 Array<{date, totalCalls, errorRate}>
    if (d?.inbound) {
      healthTrend.value = d.inbound.map((p: any) => ({
        date: p.date,
        totalCalls: p.calls,
        errorRate: p.errorRatePct
      }))
    } else {
      healthTrend.value = []
    }
  } catch { healthTrend.value = [] }
}