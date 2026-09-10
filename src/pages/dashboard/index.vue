<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>📊 插件运营看板</h1>
        <div class="sub">Plugin Operations Dashboard</div>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">运营看板</div>
        <div
          v-for="nav in navItems"
          :key="nav.key"
          class="nav-item"
          :class="{ active: activeSection === nav.key }"
          @click="activeSection = nav.key"
        >
          <span class="icon">{{ nav.icon }}</span><span>{{ nav.label }}</span>
          <span v-if="nav.badge" class="badge">{{ nav.badge }}</span>
        </div>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <h2>{{ currentTitle }}</h2>
        <div class="actions">
          <div class="date-range">📅 数据截至昨日（{{ updateDate }}）· 更新于 {{ lastRefreshed }}</div>
          <button class="btn-refresh" @click="refreshData" :disabled="refreshing">{{ refreshing ? '🔄 刷新中...' : '🔄 刷新数据' }}</button>
        </div>
      </header>

      <div class="content">
        <!-- ======== Section 1: 业务核心指标 ======== -->
        <section v-if="activeSection === 's1'" class="section">
          <!-- 开发者相关 -->
          <div class="sub-section-title">开发者相关</div>
          <div class="kpi-grid">
            <KpiCard
              label="开发者总数"
              :value="fmt(store.developerSummary?.totalDevelopers)"
              trend="↑ 较上月增长"
              trend-dir="up"
              accent="blue"
              icon="👥"
            >
              <template #badge>
                <div class="kpi-badge">
                  <div class="badge-label">新增环比</div>
                  <div class="badge-num">{{ fmt(store.developerSummary?.newUsersThisMonth) }}</div>
                  <div class="badge-trend up">↑ {{ store.developerSummary?.newUsersGrowthRate ?? '--' }}%</div>
                </div>
              </template>
            </KpiCard>
            <KpiCard
              label="Agent接入总数"
              :value="fmt(store.developerSummary?.agentTotal)"
              trend="↑ 较上月增长"
              trend-dir="up"
              accent="green"
              icon="🤖"
            />
            <KpiCard
              label="日活跃数（DAU）"
              :value="fmt(store.developerSummary?.dau)"
              trend="昨日活跃"
              trend-dir="up"
              accent="cyan"
              icon="☀️"
            />
            <KpiCard
              label="月活跃数（MAU）"
              :value="fmt(store.developerSummary?.mau)"
              trend="近30天活跃"
              trend-dir="up"
              accent="purple"
              icon="🌙"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="DAU / MAU 趋势（近30天）" desc="日活和月活趋势" :option="dauTrendOpt" :height="320" />
            <ChartCard title="新增用户趋势（环比 vs 同比）" desc="近6个月每月新增用户及增长率" :option="newUserTrendOpt" :height="320" />
          </div>

          <!-- 插件的开发者画像 -->
          <div class="sub-section-title" style="margin-top:24px">插件的开发者画像</div>
          <div class="kpi-grid">
            <KpiCard
              label="插件总下载量"
              :value="fmt(store.downloadChannelSummary?.totalDownloads)"
              trend="GitHub + npm 累计"
              trend-dir="up"
              accent="blue"
              icon="📦"
            />
            <KpiCard
              label="GitHub 下载/Clone"
              :value="fmt(store.downloadChannelSummary?.githubDownloads)"
              trend="Clone + Release 累计"
              trend-dir="up"
              accent="green"
              icon="🐙"
            />
            <KpiCard
              label="npm 下载量"
              :value="fmt(store.downloadChannelSummary?.npmDownloads)"
              trend="npm 累计下载"
              trend-dir="up"
              accent="orange"
              icon="📊"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="Agent 接入数量（按种类分布）" desc="按Agent名称合并统计（不区分平台）" :option="agentDistOpt" :height="320" />
            <ChartCard title="下载渠道占比" desc="GitHub vs npm 下载量占比分布" :option="downloadPieOpt" :height="320" />
          </div>
          <div class="chart-row one">
            <ChartCard title="插件下载量趋势（GitHub + npm）" desc="近30天 GitHub 与 npm 下载量趋势" :option="downloadTrendOpt" :height="320" />
          </div>
        </section>

        <!-- ======== Section 2: 开放能力 ======== -->
        <section v-if="activeSection === 's2'" class="section">
          <div class="kpi-grid">
            <KpiCard label="开放能力调用总次数" :value="fmt(store.capabilitySummary?.totalCalls)" trend="累计调用" trend-dir="up" accent="blue" icon="🛠️" />
            <KpiCard label="Skill 调用总次数" :value="fmt(getCapItem('skill'))" trend="累计调用" trend-dir="up" accent="green" icon="🔗" />
            <KpiCard label="MCP 调用总次数" :value="fmt(getCapItem('mcp'))" trend="累计调用" trend-dir="up" accent="orange" icon="⚡" />
          </div>
          <div class="chart-row two">
            <ChartCard title="调用次数趋势（Skill / MCP / 开放能力）" desc="近14天 Skill调用、MCP调用、开放能力调用次数趋势" :option="capTrendOpt" />
            <ChartCard title="开放能力调用占比分布" desc="MCP / CLI 调用占比" :option="capPieOpt" />
          </div>
          <div class="chart-row one">
            <ChartCard title="Skill 明细调用排行（Top 10）" desc="通过插件调用各Skill的次数排行" :option="skillRankOpt" :height="320" />
          </div>
        </section>

        <!-- ======== Section 4: 沙箱资源信息 ======== -->
        <section v-if="activeSection === 's4'" class="section">
          <div class="kpi-grid">
            <KpiCard
              label="沙箱总用户数"
              :value="fmt(store.sandboxSummary?.totalUsers)"
              trend="累计总量"
              trend-dir="up"
              accent="blue"
              icon="📦"
            />
            <KpiCard
              label="今日沙箱用户数"
              :value="fmt(store.sandboxSummary?.dailyUsers)"
              :trend="`↑ ${store.sandboxSummary?.dailyUsersChainRatio?.toFixed(1) ?? '--'}% 较昨日`"
              trend-dir="up"
              accent="green"
              icon="📅"
            />
            <KpiCard
              label="平均拉起耗时"
              :value="store.sandboxSummary?.avgDurationSec?.toFixed(1) ?? '--'"
              unit="秒"
              :trend="`${store.sandboxSummary?.avgDurationDeltaSec != null && store.sandboxSummary.avgDurationDeltaSec >= 0 ? '↑' : '↓'} ${Math.abs(store.sandboxSummary?.avgDurationDeltaSec ?? 0).toFixed(1)}s 较昨日`"
              :trend-dir="store.sandboxSummary?.avgDurationDeltaSec != null && store.sandboxSummary.avgDurationDeltaSec >= 0 ? 'up' : 'down'"
              accent="orange"
              icon="⏱️"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="沙箱用户数趋势（近30天）" desc="每日沙箱去重用户数与事件总次数趋势" :option="sandboxTrendOpt" />
            <ChartCard title="沙箱拉起耗时分布" desc="拉起耗时区间分布（秒），监控性能瓶颈" :option="sandboxDurationOpt" />
          </div>
          <div class="chart-row one">
            <ChartCard title="每小时沙箱用户数（今日）" desc="今日各时段沙箱去重用户数分布，识别使用高峰" :option="sandboxHourlyOpt" :height="260" />
          </div>
        </section>

        <!-- ======== Section 5: 代金券资源信息 ======== -->
        <section v-if="activeSection === 's5'" class="section">
          <div class="kpi-grid">
            <KpiCard
              label="已领取总人数"
              :value="fmt(store.voucherSummary?.totalCount)"
              trend="↑ 累计总量"
              trend-dir="up"
              accent="blue"
              icon="👥"
            />
            <KpiCard
              label="代金券总发放金额"
              :value="fmtYuanWithSymbol(store.voucherSummary?.totalAmount)"
              trend="↑ 累计总额"
              trend-dir="up"
              accent="green"
              icon="💰"
            />
            <KpiCard
              label="今日领取人数"
              :value="fmt(store.voucherSummary?.todayCount)"
              :trend="`↑ ${store.voucherSummary?.todayCountChainRatio?.toFixed(1) ?? '--'}% 较昨日`"
              trend-dir="up"
              accent="orange"
              icon="📅"
            />
            <KpiCard
              label="今日发放金额"
              :value="fmtYuanWithSymbol(store.voucherSummary?.todayAmount)"
              :trend="`↑ ${store.voucherSummary?.todayAmountChainRatio?.toFixed(1) ?? '--'}% 较昨日`"
              trend-dir="up"
              accent="cyan"
              icon="💵"
            />
            <KpiCard
              label="本月领取人数"
              :value="fmt(store.voucherSummary?.monthCount)"
              :trend="`↑ ${store.voucherSummary?.monthCountChainRatio?.toFixed(1) ?? '--'}% 环比`"
              trend-dir="up"
              accent="purple"
              icon="🌙"
            />
            <KpiCard
              label="本月发放金额"
              :value="fmtYuanWithSymbol(store.voucherSummary?.monthAmount)"
              :trend="`↑ ${store.voucherSummary?.monthAmountChainRatio?.toFixed(1) ?? '--'}% 环比`"
              trend-dir="up"
              accent="red"
              icon="💴"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="代金券领取趋势（近30天）" desc="每日领取人数与发放金额趋势" :option="voucherTrendOpt" />
            <ChartCard title="代金券面额分布" desc="不同面额代金券的领取占比" :option="voucherPieOpt" />
          </div>
        </section>

        <!-- ======== Section 6: 活动统计 ======== -->
        <section v-if="activeSection === 's6'" class="section">
          <div class="kpi-grid">
            <KpiCard
              label="参与总人数"
              :value="fmt(store.activitySummary?.totalParticipants)"
              trend="↑ 活动进行中"
              trend-dir="up"
              accent="blue"
              icon="🎯"
            />
            <KpiCard
              label="初章完成人数"
              :value="fmt(store.activitySummary?.chapter1Completed)"
              :trend="`完成率 ${store.activitySummary?.chapter1Rate?.toFixed(1) ?? '--'}%`"
              trend-dir="flat"
              accent="green"
              icon="📖"
            />
            <KpiCard
              label="进阶章完成人数"
              :value="fmt(store.activitySummary?.chapter2Completed)"
              :trend="`完成率 ${store.activitySummary?.chapter2Rate?.toFixed(1) ?? '--'}%`"
              trend-dir="flat"
              accent="orange"
              icon="📚"
            />
            <KpiCard
              label="终章完成人数"
              :value="fmt(store.activitySummary?.chapter3Completed)"
              :trend="`完成率 ${store.activitySummary?.chapter3Rate?.toFixed(1) ?? '--'}%`"
              trend-dir="flat"
              accent="purple"
              icon="🏆"
            />
          </div>
          <div class="chart-row one">
            <div class="chart-card">
              <div class="chart-title">活动转化漏斗</div>
              <div class="chart-desc">参与 → 初章完成 → 进阶章完成 → 终章完成 各阶段转化率分析</div>
              <div ref="funnelRef" :style="{ height: '380px' }"></div>
              <AlertBanner
                style="margin-top:12px"
                title="转化分析"
                :text="funnelAlertText"
              />
            </div>
          </div>
          <div class="chart-row two">
            <ChartCard title="各阶段每日完成人数趋势" desc="近14天各章节每日完成人数趋势" :option="activityTrendOpt" />
            <ChartCard title="各阶段转化率对比" desc="阶段间转化率与整体转化率分析" :option="activityConvOpt" />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import KpiCard from './components/KpiCard.vue'
import ChartCard from './components/ChartCard.vue'
import AlertBanner from './components/AlertBanner.vue'
import { useDashboardStore, fmtYuanWithSymbol } from '@/store/dashboard'
import {
  getEmptyChartOption,
  buildDauTrendOption, buildAgentDistributionOption, buildNewUserTrendOption,
  buildDownloadPieOption, buildDownloadTrendOption,
  buildCapabilityTrendOption, buildCapabilityPieOption, buildSkillRankOption,
  buildSandboxTrendOption, buildSandboxDurationOption, buildSandboxHourlyOption,
  buildVoucherTrendOption, buildVoucherPieOption,
  buildActivityFunnelOption, buildActivityTrendOption, buildActivityConvOption,
} from './data/charts'

const store = useDashboardStore()

/** 格式化数字（千分位） */
function fmt(val: number | undefined | null): string {
  if (val == null) return '--'
  return val.toLocaleString()
}

const activeSection = ref('s1')

watch(activeSection, () => {
  window.scrollTo(0, 0)
})

const navItems = [
  { key: 's1', icon: '📈', label: '业务核心指标', badge: '' },
  { key: 's2', icon: '🔌', label: '开放能力', badge: '' },
  { key: 's4', icon: '🖥️', label: '沙箱资源信息', badge: '' },
  { key: 's5', icon: '🎫', label: '代金券资源', badge: '' },
  { key: 's6', icon: '🎯', label: '活动统计', badge: '' },
]

const titleMap: Record<string, string> = {
  s1: '业务核心指标', s2: '开放能力',
  s4: '沙箱资源信息', s5: '代金券资源信息', s6: '活动统计信息',
}

const currentTitle = computed(() => titleMap[activeSection.value] || '运营看板')
const refreshing = ref(false)
const lastRefreshed = ref('--')

/** 看板数据为 T-1 口径，头部展示昨日日期 */
const updateDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// Funnel chart (special case — manual echarts.init, not ChartCard :option)
const funnelRef = ref<HTMLDivElement>()
let funnelChart: echarts.ECharts | null = null

// Activity computed options
const activityFunnelOpt = computed(() =>
  store.activitySummary?.funnel?.length
    ? buildActivityFunnelOption(store.activitySummary.funnel)
    : getEmptyChartOption()
)

const funnelAlertText = computed(() => {
  const s = store.activitySummary
  if (!s || s.totalParticipants === 0) return '暂无活动数据'
  const c1Drop = (100 - s.chapter1Rate).toFixed(1)
  const c2Drop = s.chapter1Rate > 0 ? (100 - (s.chapter2Rate / s.chapter1Rate * 100)).toFixed(1) : '--'
  const c3Drop = s.chapter2Rate > 0 ? (100 - (s.chapter3Rate / s.chapter2Rate * 100)).toFixed(1) : '--'
  const drops = [
    { stage: '参与→初章', rate: c1Drop },
    { stage: '初章→进阶章', rate: c2Drop },
    { stage: '进阶章→终章', rate: c3Drop },
  ]
  const maxDrop = drops.reduce((a, b) => parseFloat(a.rate) > parseFloat(b.rate) ? a : b)
  return `${maxDrop.stage}流失率最高（${maxDrop.rate}%），建议优化该环节任务难度或增加引导。终章完成率${s.chapter3Rate.toFixed(1)}%仍有提升空间。`
})

function initFunnel() {
  if (!funnelRef.value) return
  if (funnelChart) funnelChart.dispose()
  funnelChart = echarts.init(funnelRef.value)
  funnelChart.setOption(activityFunnelOpt.value)
}

watch(activeSection, (sec) => {
  if (sec === 's6') {
    nextTick(initFunnel)
  }
})

watch(activityFunnelOpt, (newOpt) => {
  if (funnelChart) {
    funnelChart.setOption(newOpt)
  }
})

const handleResize = () => funnelChart?.resize()

onMounted(async () => {
  nextTick(initFunnel)
  window.addEventListener('resize', handleResize)
  await store.loadBusinessMetrics()
  lastRefreshed.value = new Date().toLocaleString('zh-CN', { hour12: false })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  funnelChart?.dispose()
})

// Chart options — API data via store, empty placeholder when no data
const dauTrendOpt = computed(() =>
  store.dauTrend.length
    ? buildDauTrendOption(store.dauTrend)
    : getEmptyChartOption()
)
const agentDistOpt = computed(() =>
  store.agentDistribution.length
    ? buildAgentDistributionOption(store.agentDistribution)
    : getEmptyChartOption()
)
const newUserTrendOpt = computed(() =>
  store.newUserTrend.length
    ? buildNewUserTrendOption(store.newUserTrend)
    : getEmptyChartOption()
)
const downloadPieOpt = computed(() =>
  store.downloadChannelDist.length
    ? buildDownloadPieOption(store.downloadChannelDist)
    : getEmptyChartOption()
)
const downloadTrendOpt = computed(() =>
  store.downloadTrend.length
    ? buildDownloadTrendOption(store.downloadTrend)
    : getEmptyChartOption()
)

function getCapItem(capName: string): number | undefined {
  const items = store.capabilityDistribution
  if (!items || !items.length) return undefined
  const item = items.find(i => i.capability === capName)
  return item?.callCount
}

const capTrendOpt = computed(() =>
  store.capabilityTrend.length
    ? buildCapabilityTrendOption(store.capabilityTrend)
    : getEmptyChartOption()
)
const capPieOpt = computed(() =>
  store.capabilityDistribution.length
    ? buildCapabilityPieOption(store.capabilityDistribution)
    : getEmptyChartOption()
)
const skillRankOpt = computed(() =>
  store.skillRanking.length
    ? buildSkillRankOption(store.skillRanking)
    : getEmptyChartOption()
)

const sandboxTrendOpt = computed(() =>
  store.sandboxTrend?.daily?.length
    ? buildSandboxTrendOption(store.sandboxTrend.daily, store.sandboxTrend.events ?? [])
    : getEmptyChartOption()
)
const sandboxDurationOpt = computed(() =>
  store.sandboxDuration?.buckets?.length
    ? buildSandboxDurationOption(store.sandboxDuration.buckets)
    : getEmptyChartOption()
)
const sandboxHourlyOpt = computed(() =>
  store.sandboxHourly?.hourly?.length
    ? buildSandboxHourlyOption(store.sandboxHourly.hourly)
    : getEmptyChartOption()
)

const voucherTrendOpt = computed(() =>
  store.voucherTrend?.daily?.length
    ? buildVoucherTrendOption(store.voucherTrend.daily)
    : getEmptyChartOption()
)
const voucherPieOpt = computed(() =>
  store.voucherDistribution?.items?.length
    ? buildVoucherPieOption(store.voucherDistribution.items)
    : getEmptyChartOption()
)

const activityTrendOpt = computed(() =>
  store.activityTrend?.chapter1?.length
    ? buildActivityTrendOption(
        store.activityTrend.chapter1,
        store.activityTrend.chapter2,
        store.activityTrend.chapter3,
      )
    : getEmptyChartOption()
)
const activityConvOpt = computed(() =>
  store.activityConversion?.stages?.length
    ? buildActivityConvOption(store.activityConversion.stages)
    : getEmptyChartOption()
)

async function refreshData() {
  refreshing.value = true
  try {
    await store.loadBusinessMetrics()
    lastRefreshed.value = new Date().toLocaleString('zh-CN', { hour12: false })
  } finally {
    refreshing.value = false
    window.dispatchEvent(new Event('resize'))
  }
}
</script>

<style lang="scss">
.hidden { display: none !important; }

// Sub-section title
.sub-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  padding-left: 10px;
  border-left: 3px solid #5b8def;
  margin-bottom: 16px;
  line-height: 1.4;
}

// KPI badge (inside KpiCard slot)
.kpi-badge {
  text-align: right;
  padding-left: 16px;
  border-left: 1px solid #f0f0f0;
  z-index: 2;
  position: relative;

  .badge-label {
    font-size: 11px;
    color: #9ca3af;
    margin-bottom: 2px;
  }
  .badge-num {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.1;
  }
  .badge-trend {
    font-size: 11px;
    margin-top: 3px;
    &.up { color: #52c41a; }
    &.down { color: #ff4d4f; }
  }
}

// Reusable chart card (used outside ChartCard component)
.chart-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);

  .chart-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .chart-desc {
    font-size: 11px;
    color: #9ca3af;
    margin-bottom: 12px;
  }
}
</style>

<style scoped lang="scss">
.dashboard {
  min-height: 100vh;
  background: #f0f2f5;
}

// Sidebar
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  background: #1e293b;
  color: #cbd5e1;
  z-index: 100;
  overflow-y: auto;
  transition: width 0.3s;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }

  .sidebar-header {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    h1 { font-size: 17px; color: #fff; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .sub { font-size: 11px; color: #64748b; margin-top: 4px; }
  }
}

.nav-section { padding: 12px 0; }
.nav-section-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #475569;
  padding: 8px 20px 4px;
  font-weight: 600;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 13px;
  color: #94a3b8;
  transition: all 0.2s;
  border-left: 3px solid transparent;

  &:hover { background: rgba(255, 255, 255, 0.05); color: #e2e8f0; }

  &.active {
    background: rgba(59, 130, 246, 0.15);
    color: #fff;
    border-left-color: #3b82f6;
  }

  .icon { width: 18px; text-align: center; font-size: 15px; }

  .badge {
    margin-left: auto;
    font-size: 10px;
    background: #ff4d4f;
    color: #fff;
    border-radius: 10px;
    padding: 1px 7px;
  }
}

// Main
.main {
  margin-left: 220px;
  min-height: 100vh;
}

.topbar {
  background: #fff;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;

  h2 { font-size: 18px; font-weight: 700; }

  .actions { display: flex; gap: 12px; align-items: center; }

  .date-range {
    font-size: 12px;
    color: #6b7280;
    background: #f0f2f5;
    padding: 6px 14px;
    border-radius: 6px;
  }

  .btn-refresh {
    background: #5b8def;
    color: #fff;
    border: none;
    padding: 7px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: background 0.2s;

    &:hover { background: #3b6fd6; }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }
}

.content {
  padding: 24px 28px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.chart-row {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;

  &.one { grid-template-columns: 1fr; }
  &.two { grid-template-columns: 1fr 1fr; }
  &.three { grid-template-columns: 1fr 1fr 1fr; }
  &.one-half { grid-template-columns: 2fr 1fr; }
}

@media (max-width: 1200px) {
  .chart-row.two, .chart-row.three, .chart-row.one-half {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar { width: 60px; }
  .sidebar-header h1, .nav-item span:not(.icon), .nav-section-title, .sidebar-header .sub { display: none; }
  .main { margin-left: 60px; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
}
</style>