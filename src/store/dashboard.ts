import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/dashboard'

// ==================== Section 1: 业务核心指标 ====================
export interface DeveloperSummary {
  totalDevelopers: number
  newUsersThisMonth: number
  newUsersGrowthRate: number
  dau: number
  mau: number
  agentTotal: number
}
export interface DauTrendItem { date: string; dau: number; mau: number }
export interface AgentDistributionItem { name: string; count: number }
export interface NpmTrendItem { date: string; downloads: number }
export interface NpmSummary {
  dailyDownloads: number
  weekDownloads: number
  cumulativeDownloads: number
}
export interface NewUserTrendItem {
  month: string
  newUserCount: number
  momRate: number | null
  yoyRate: number | null
}
export interface DownloadChannelSummary {
  totalDownloads: number
  githubDownloads: number
  npmDownloads: number
  githubTrend: number | null
  npmTrend: number | null
}
export interface DownloadChannelItem { channel: string; count: number; percentage: number }
export interface DownloadTrendItem {
  date: string
  npmDownloads: number
  githubDownloads: number | null
}

// ==================== Section 2: 开放能力 ====================
export interface CapabilitySummary {
  totalCalls: number
  uniqueUsers: number
  dailyAvg: number
  todayCalls: number
}
export interface CapabilityTrendLine { capability: string; data: number[][] }
export interface CapabilityTrend { dates: string[]; lines: CapabilityTrendLine[] }
export interface CapabilityDistItem { capability: string; callCount: number; percentage: number }
export interface CapabilityDistribution { items: CapabilityDistItem[] }
export interface SkillItem { rank: number; skillName: string; callCount: number; percentage: number }
export interface SkillRanking { skills: SkillItem[] }

// ==================== Section 4: 沙箱资源 ====================
export interface SandboxSummary {
  totalUsers: number
  dailyUsers: number
  chainRatio: number
  avgSec: number
  avgDeltaSec: number
  p95Sec: number
  sla: string
}
export interface SandboxTrendPoint { date: string; value: number }
export interface SandboxTrend { daily: SandboxTrendPoint[]; events: SandboxTrendPoint[][]; total: number }
export interface SandboxDurationBucket { label: string; order: number; count: number }
export interface SandboxDuration { date: string; buckets: SandboxDurationBucket[] }
export interface SandboxHourlyPoint { hour: number; count: number }
export interface SandboxHourly { date: string; points: SandboxHourlyPoint[] }

// ==================== Section 5: 代金券 ====================
export interface VoucherSummary {
  totalCount: number
  totalAmount: number
  todayCount: number
  todayAmount: number
  todayCountChain: number
  todayAmountChain: number
  monthCount: number
  monthAmount: number
  monthCountChain: number
  monthAmountChain: number
}
export interface VoucherTrendPoint { date: string; count: number; amount: number }
export interface VoucherTrend { points: VoucherTrendPoint[] }
export interface VoucherDistItem { faceAmount: number; claimCount: number; percentage: number }
export interface VoucherDistribution { items: VoucherDistItem[] }

// ==================== Section 6: 活动统计 ====================
export interface FunnelStage { name: string; value: number; rate: number }
export interface ActivitySummary {
  totalParticipants: number
  chapter1Completed: number
  chapter2Completed: number
  chapter3Completed: number
  chapter1Rate: number
  chapter2Rate: number
  chapter3Rate: number
  funnel: FunnelStage[]
}
export interface ActivityTrendPoint { date: string; value: number }
export interface ActivityTrend {
  chapter1: ActivityTrendPoint[]
  chapter2: ActivityTrendPoint[]
  chapter3: ActivityTrendPoint[]
}
export interface ConvItem { label: string; rate: number }
export interface ActivityConversion { stages: ConvItem[] }

export const useDashboardStore = defineStore('dashboard', () => {
  // Section 1
  const developerSummary = ref<DeveloperSummary | null>(null)
  const dauTrend = ref<DauTrendItem[]>([])
  const agentDistribution = ref<AgentDistributionItem[]>([])
  const npmTrend = ref<NpmTrendItem[]>([])
  const npmSummary = ref<NpmSummary | null>(null)
  const newUserTrend = ref<NewUserTrendItem[]>([])
  const downloadChannelSummary = ref<DownloadChannelSummary | null>(null)
  const downloadChannelDist = ref<DownloadChannelItem[]>([])
  const downloadTrend = ref<DownloadTrendItem[]>([])

  // Section 2
  const capabilitySummary = ref<CapabilitySummary | null>(null)
  const capabilityTrend = ref<CapabilityTrend | null>(null)
  const capabilityDistribution = ref<CapabilityDistribution | null>(null)
  const skillRanking = ref<SkillRanking | null>(null)

  // Section 4
  const sandboxSummary = ref<SandboxSummary | null>(null)
  const sandboxTrend = ref<SandboxTrend | null>(null)
  const sandboxDuration = ref<SandboxDuration | null>(null)
  const sandboxHourly = ref<SandboxHourly | null>(null)

  // Section 5
  const voucherSummary = ref<VoucherSummary | null>(null)
  const voucherTrend = ref<VoucherTrend | null>(null)
  const voucherDistribution = ref<VoucherDistribution | null>(null)

  // Section 6
  const activitySummary = ref<ActivitySummary | null>(null)
  const activityTrend = ref<ActivityTrend | null>(null)
  const activityConversion = ref<ActivityConversion | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Section 1 load functions
  async function loadDeveloperSummary() {
    developerSummary.value = await api.getDeveloperSummary() as any
  }
  async function loadDauTrend(days = 30) {
    dauTrend.value = (await api.getDeveloperTrend(days) as any)?.points || []
  }
  async function loadAgentDistribution() {
    const data = await api.getAgentDistribution() as any
    agentDistribution.value = data?.items || []
  }
  async function loadNpmTrend(days = 30) {
    const data = await api.getNpmDownloadTrend(days) as any
    npmTrend.value = data?.npmDaily || []
  }
  async function loadNpmSummary() {
    npmSummary.value = await api.getNpmDownloadSummary() as any
  }
  async function loadNewUserTrend() {
    newUserTrend.value = (await api.getNewUserTrend() as any)?.months || []
  }
  async function loadDownloadChannelSummary() {
    downloadChannelSummary.value = await api.getDownloadChannelSummary() as any
  }
  async function loadDownloadChannelDist() {
    const data = await api.getDownloadChannelDistribution() as any
    downloadChannelDist.value = data?.channels || []
  }
  async function loadDownloadTrend(days = 30) {
    const data = await api.getDownloadTrend(days) as any
    downloadTrend.value = data?.points || []
  }

  // Section 2 load functions
  async function loadCapabilitySummary() {
    capabilitySummary.value = await api.getCapabilitySummary() as any
  }
  async function loadCapabilityTrend() {
    capabilityTrend.value = await api.getCapabilityTrend() as any
  }
  async function loadCapabilityDistribution() {
    capabilityDistribution.value = await api.getCapabilityDistribution() as any
  }
  async function loadSkillRanking() {
    skillRanking.value = await api.getSkillRanking() as any
  }

  // Section 4 load functions
  async function loadSandboxSummary() {
    sandboxSummary.value = await api.getSandboxSummary() as any
  }
  async function loadSandboxTrend() {
    sandboxTrend.value = await api.getSandboxTrend() as any
  }
  async function loadSandboxDuration() {
    sandboxDuration.value = await api.getSandboxDuration() as any
  }
  async function loadSandboxHourly() {
    sandboxHourly.value = await api.getSandboxHourly() as any
  }

  // Section 5 load functions
  async function loadVoucherSummary() {
    voucherSummary.value = await api.getVoucherSummary() as any
  }
  async function loadVoucherTrend() {
    voucherTrend.value = await api.getVoucherTrend() as any
  }
  async function loadVoucherDistribution() {
    voucherDistribution.value = await api.getVoucherDistribution() as any
  }

  // Section 6 load functions
  async function loadActivitySummary() {
    activitySummary.value = await api.getActivitySummary() as any
  }
  async function loadActivityTrend() {
    activityTrend.value = await api.getActivityTrend() as any
  }
  async function loadActivityConversion() {
    activityConversion.value = await api.getActivityConversion() as any
  }

  async function loadBusinessMetrics() {
    loading.value = true
    error.value = null
    const results = await Promise.allSettled([
      loadDeveloperSummary(),
      loadDauTrend(),
      loadAgentDistribution(),
      loadNpmTrend(),
      loadNpmSummary(),
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
      loadActivitySummary(),
      loadActivityTrend(),
      loadActivityConversion(),
    ])
    const failures = results.filter(r => r.status === 'rejected')
    if (failures.length === results.length) {
      error.value = '所有接口请求失败'
    } else if (failures.length > 0) {
      error.value = `${failures.length}/${results.length} 个接口请求失败`
    }
    loading.value = false
  }

  return {
    // Section 1
    developerSummary, dauTrend, agentDistribution, npmTrend, npmSummary,
    newUserTrend, downloadChannelSummary, downloadChannelDist, downloadTrend,
    // Section 2
    capabilitySummary, capabilityTrend, capabilityDistribution, skillRanking,
    // Section 4
    sandboxSummary, sandboxTrend, sandboxDuration, sandboxHourly,
    // Section 5
    voucherSummary, voucherTrend, voucherDistribution,
    // Section 6
    activitySummary, activityTrend, activityConversion,
    // state
    loading, error,
    // load functions
    loadDeveloperSummary, loadDauTrend, loadAgentDistribution,
    loadNpmTrend, loadNpmSummary, loadNewUserTrend,
    loadDownloadChannelSummary, loadDownloadChannelDist, loadDownloadTrend,
    loadCapabilitySummary, loadCapabilityTrend, loadCapabilityDistribution, loadSkillRanking,
    loadSandboxSummary, loadSandboxTrend, loadSandboxDuration, loadSandboxHourly,
    loadVoucherSummary, loadVoucherTrend, loadVoucherDistribution,
    loadActivitySummary, loadActivityTrend, loadActivityConversion,
    loadBusinessMetrics,
  }
})
