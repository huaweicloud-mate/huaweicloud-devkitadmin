import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/dashboard'

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

export interface NpmTrendItem {
  date: string
  downloads: number
}

export interface NpmSummary {
  dailyDownloads: number
  weekDownloads: number
  cumulativeDownloads: number
}

export interface CapabilitySummary {
  totalCalls: number
  uniqueUsers: number
  dailyAvgCalls: number
  todayCalls: number
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

export interface SandboxSummary {
  totalUsers: number
  dailyUsers: number
  dailyUsersChainRatio: number
  avgDurationSec: number
  avgDurationDeltaSec: number
  p95DurationSec: number
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
  todayCount: number
  todayAmount: number
  todayCountChainRatio: number
  todayAmountChainRatio: number
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
  const npmTrend = ref<NpmTrendItem[]>([])
  const npmSummary = ref<NpmSummary | null>(null)
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

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadDeveloperSummary() {
    const raw: any = await api.getDeveloperSummary()
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
    const raw: any = await api.getDeveloperTrend(days)
    dauTrend.value = raw?.points ?? raw ?? []
  }

  async function loadAgentDistribution() {
    const raw: any = await api.getAgentDistribution()
    agentDistribution.value = raw?.agents ?? raw ?? []
  }

  async function loadNpmTrend(days = 30) {
    const raw: any = await api.getNpmDownloadTrend(days)
    npmTrend.value = raw?.npmDaily ?? raw ?? []
  }

  async function loadNpmSummary() {
    const raw: any = await api.getNpmDownloadSummary()
    npmSummary.value = {
      dailyDownloads: raw.npmToday ?? raw.dailyDownloads ?? 0,
      weekDownloads: raw.npmWeek ?? raw.weekDownloads ?? 0,
      cumulativeDownloads: raw.npmCumulative ?? raw.cumulativeDownloads ?? 0,
    }
  }

  async function loadCapabilitySummary() {
    const data: any = await api.getCapabilitySummary()
    capabilitySummary.value = data
  }

  async function loadCapabilityTrend(days = 14) {
    const raw: any = await api.getCapabilityTrend(days)
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
    const raw: any = await api.getCapabilityDistribution()
    capabilityDistribution.value = raw?.capabilities ?? raw ?? []
  }

  async function loadSkillRanking(limit = 10) {
    const raw: any = await api.getSkillRanking(limit)
    skillRanking.value = raw?.skills ?? raw ?? []
  }

  async function loadSandboxSummary() {
    const data: any = await api.getSandboxSummary()
    sandboxSummary.value = data
  }

  async function loadSandboxTrend() {
    const raw: any = await api.getSandboxTrend()
    sandboxTrend.value = raw
  }

  async function loadSandboxDuration() {
    const raw: any = await api.getSandboxDuration()
    sandboxDuration.value = raw
  }

  async function loadSandboxHourly() {
    const raw: any = await api.getSandboxHourly()
    sandboxHourly.value = raw
  }

  async function loadVoucherSummary() {
    const data: any = await api.getVoucherSummary()
    voucherSummary.value = data
  }

  async function loadVoucherTrend() {
    const raw: any = await api.getVoucherTrend()
    voucherTrend.value = raw
  }

  async function loadVoucherDistribution() {
    const raw: any = await api.getVoucherDistribution()
    voucherDistribution.value = raw
  }

  async function loadActivitySummary() {
    const data: any = await api.getActivitySummary()
    activitySummary.value = data
  }

  async function loadActivityTrend() {
    const raw: any = await api.getActivityTrend()
    activityTrend.value = raw
  }

  async function loadActivityConversion() {
    const raw: any = await api.getActivityConversion()
    activityConversion.value = raw
  }

  async function loadBusinessMetrics() {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        loadDeveloperSummary(),
        loadDauTrend(),
        loadAgentDistribution(),
        loadNpmTrend(),
        loadNpmSummary(),
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
        loadActivitySummary(),
        loadActivityTrend(),
        loadActivityConversion(),
      ])
    } catch (e: any) {
      error.value = e.message || 'Failed to load metrics'
    } finally {
      loading.value = false
    }
  }

  return {
    developerSummary,
    dauTrend,
    agentDistribution,
    npmTrend,
    npmSummary,
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
    loading,
    error,
    loadDeveloperSummary,
    loadDauTrend,
    loadAgentDistribution,
    loadNpmTrend,
    loadNpmSummary,
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
    loadActivitySummary,
    loadActivityTrend,
    loadActivityConversion,
    loadBusinessMetrics,
  }
})
