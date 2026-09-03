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

export const useDashboardStore = defineStore('dashboard', () => {
  const developerSummary = ref<DeveloperSummary | null>(null)
  const dauTrend = ref<DauTrendItem[]>([])
  const agentDistribution = ref<AgentDistributionItem[]>([])
  const npmTrend = ref<NpmTrendItem[]>([])
  const npmSummary = ref<NpmSummary | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadDeveloperSummary() {
    const data = await api.getDeveloperSummary()
    developerSummary.value = data as any
  }

  async function loadDauTrend(days = 30) {
    const data = await api.getDeveloperTrend(days)
    dauTrend.value = data as any
  }

  async function loadAgentDistribution() {
    const data = await api.getAgentDistribution()
    agentDistribution.value = data as any
  }

  async function loadNpmTrend(days = 30) {
    const data = await api.getNpmDownloadTrend(days)
    npmTrend.value = data as any
  }

  async function loadNpmSummary() {
    const data = await api.getNpmDownloadSummary()
    npmSummary.value = data as any
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
    loading,
    error,
    loadDeveloperSummary,
    loadDauTrend,
    loadAgentDistribution,
    loadNpmTrend,
    loadNpmSummary,
    loadBusinessMetrics,
  }
})
