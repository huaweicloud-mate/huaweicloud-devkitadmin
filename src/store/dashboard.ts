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
    loadBusinessMetrics,
  }
})
