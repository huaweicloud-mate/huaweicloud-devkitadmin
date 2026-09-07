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
        </div>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <h2>{{ currentTitle }}</h2>
        <div class="actions">
          <div class="date-range">📅 数据更新: {{ updateDate }}</div>
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
              trend="今日活跃"
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
              trend="累计总量"
              trend-dir="up"
              accent="blue"
              icon="📦"
            />
            <KpiCard
              label="GitHub 下载/Clone"
              :value="fmt(store.downloadChannelSummary?.githubDownloads)"
              trend="GitHub 数据接入中"
              trend-dir="flat"
              accent="green"
              icon="🐙"
            />
            <KpiCard
              label="npm 下载量"
              :value="fmt(store.npmSummary?.cumulativeDownloads)"
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
            <KpiCard
              label="Skill 调用总次数"
              :value="fmt(store.capabilitySummary?.totalCalls)"
              trend="累计调用"
              trend-dir="up"
              accent="blue"
              icon="🛠️"
            />
            <KpiCard
              label="MCP 调用总次数"
              :value="fmt(getCapItem('MCP'))"
              trend="累计调用"
              trend-dir="up"
              accent="green"
              icon="🔗"
            />
            <KpiCard
              label="开放能力调用总次数"
              :value="fmt(getCapItem('CLI'))"
              trend="累计调用"
              trend-dir="up"
              accent="orange"
              icon="⚡"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="调用次数趋势（Skill / MCP / 开放能力）" desc="近14天 Skill调用、MCP调用、开放能力调用次数趋势" :option="capTrendOpt" />
            <ChartCard title="开放能力调用占比分布" desc="MCP / CLI / Skill 调用占比" :option="capPieOpt" />
          </div>
          <div class="chart-row one">
            <ChartCard title="Skill 明细调用排行（Top 10）" desc="通过插件调用各Skill的次数排行" :option="skillRankOpt" :height="320" />
          </div>
        </section>

        <!-- ======== Section 4: 沙箱资源信息 ======== -->
        <section v-if="activeSection === 's4'" class="section">
          <div class="kpi-grid">
            <KpiCard
              label="总拉取沙箱次数"
              :value="fmt(store.sandboxSummary?.totalUsers)"
              trend="↑ 累计总量"
              trend-dir="up"
              accent="blue"
              icon="📦"
            />
            <KpiCard
              label="今日拉取次数"
              :value="fmt(store.sandboxSummary?.dailyUsers)"
              :trend="chainTrend(store.sandboxSummary?.chainRatio)"
              :trend-dir="chainDir(store.sandboxSummary?.chainRatio)"
              accent="green"
              icon="📅"
            />
            <KpiCard
              label="平均创建耗时"
              :value="store.sandboxSummary?.avgSec?.toFixed(1) ?? '--'"
              unit="秒"
              trend="平均耗时"
              trend-dir="flat"
              accent="orange"
              icon="⏱️"
            />
            <KpiCard
              label="P95 创建耗时"
              :value="store.sandboxSummary?.p95Sec?.toFixed(1) ?? '--'"
              unit="秒"
              :trend="'SLA: ' + (store.sandboxSummary?.sla || '<20s')"
              trend-dir="flat"
              accent="purple"
              icon="📈"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="沙箱拉取次数趋势（近30天）" desc="每日沙箱拉取总次数与成功次数对比" :option="sandboxTrendOpt" />
            <ChartCard title="沙箱创建耗时分布" desc="创建耗时区间分布（秒），监控性能瓶颈" :option="sandboxDurationOpt" />
          </div>
          <div class="chart-row one">
            <ChartCard title="每小时沙箱拉取热力（今日）" desc="今日各时段沙箱拉取次数分布，识别使用高峰" :option="sandboxHourlyOpt" :height="260" />
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
              :value="'¥' + fmt(store.voucherSummary?.totalAmount)"
              trend="↑ 累计总额"
              trend-dir="up"
              accent="green"
              icon="💰"
            />
            <KpiCard
              label="今日领取人数"
              :value="fmt(store.voucherSummary?.todayCount)"
              :trend="chainTrend(store.voucherSummary?.todayCountChain)"
              :trend-dir="chainDir(store.voucherSummary?.todayCountChain)"
              accent="orange"
              icon="📅"
            />
            <KpiCard
              label="今日发放金额"
              :value="'¥' + fmt(store.voucherSummary?.todayAmount)"
              :trend="chainTrend(store.voucherSummary?.todayAmountChain)"
              :trend-dir="chainDir(store.voucherSummary?.todayAmountChain)"
              accent="cyan"
              icon="💵"
            />
            <KpiCard
              label="本月领取人数"
              :value="fmt(store.voucherSummary?.monthCount)"
              :trend="chainTrend(store.voucherSummary?.monthCountChain)"
              :trend-dir="chainDir(store.voucherSummary?.monthCountChain)"
              accent="purple"
              icon="🌙"
            />
            <KpiCard
              label="本月发放金额"
              :value="'¥' + fmt(store.voucherSummary?.monthAmount)"
              :trend="chainTrend(store.voucherSummary?.monthAmountChain)"
              :trend-dir="chainDir(store.voucherSummary?.monthAmountChain)"
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
      :trend="'完成率 ' + (store.activitySummary?.chapter1Rate ?? 0) + '%'"
              trend-dir="flat"
              accent="green"
              icon="📖"
            />
            <KpiCard
              label="第二章完成人数"
              :value="fmt(store.activitySummary?.chapter2Completed)"
      :trend="'完成率 ' + (store.activitySummary?.chapter2Rate ?? 0) + '%'"
              trend-dir="flat"
              accent="orange"
              icon="📚"
            />
            <KpiCard
              label="终章完成人数"
              :value="fmt(store.activitySummary?.chapter3Completed)"
      :trend="'完成率 ' + (store.activitySummary?.chapter3Rate ?? 0) + '%'"
              trend-dir="flat"
              accent="purple"
              icon="🏆"
            />
          </div>
          <div class="chart-row one">
            <div class="chart-card">
              <div class="chart-title">活动转化漏斗</div>
              <div class="chart-desc">参与 → 初章完成 → 第二章完成 → 终章完成 各阶段转化率分析</div>
              <div ref="funnelRef" :style="{ height: '380px' }"></div>
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
import { useDashboardStore } from '@/store/dashboard'
import {
  getDauMauOption, getNewUserOption, getAgentTypeOption, getDownloadTrendOption, getDownloadPieOption,
  getCapabilityTrendOption, getCapabilityPieOption, getSkillRankOption,
  getSandboxTrendOption, getSandboxDurationOption, getSandboxHourlyOption,
  getVoucherTrendOption, getVoucherPieOption,
  getActivityTrendOption, getActivityConvOption, getActivityFunnelOption,
  buildDauTrendOption, buildAgentDistributionOption,
  buildNewUserTrendOption, buildDownloadPieOption, buildDownloadTrendOption,
  buildCapabilityTrendOption, buildCapabilityPieOption, buildSkillRankOption,
  buildSandboxTrendOption, buildSandboxDurationOption, buildSandboxHourlyOption,
  buildVoucherTrendOption, buildVoucherPieOption,
  buildActivityTrendOption, buildActivityConvOption,
} from './data/charts'

const store = useDashboardStore()

function fmt(val: number | undefined | null): string {
  if (val == null) return '--'
  return val.toLocaleString()
}

function chainTrend(rate: number | undefined | null): string {
  if (rate == null) return '--'
  return (rate >= 0 ? '↑ ' : '↓ ') + Math.abs(rate).toFixed(1) + '% 环比'
}

function chainDir(rate: number | undefined | null): 'flat' | 'up' | 'down' {
  if (rate == null || rate === 0) return 'flat'
  return rate > 0 ? 'up' : 'down'
}

const updateDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} 08:00`
})

const activeSection = ref('s1')

watch(activeSection, () => {
  window.scrollTo(0, 0)
})

const navItems = [
  { key: 's1', icon: '📈', label: '业务核心指标' },
  { key: 's2', icon: '🔌', label: '开放能力' },
  { key: 's4', icon: '🖥️', label: '沙箱资源信息' },
  { key: 's5', icon: '🎫', label: '代金券资源' },
  { key: 's6', icon: '🎯', label: '活动统计' },
]

const titleMap: Record<string, string> = {
  s1: '业务核心指标', s2: '开放能力',
  s4: '沙箱资源信息', s5: '代金券资源信息', s6: '活动统计信息',
}

const currentTitle = computed(() => titleMap[activeSection.value] || '运营看板')
const refreshing = ref(false)

// Funnel chart (special case)
const funnelRef = ref<HTMLDivElement>()
let funnelChart: echarts.ECharts | null = null

function getFunnelOption(): echarts.EChartsOption {
  const s = store.activitySummary
  if (s && s.funnel && s.funnel.length) {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => p.name + '<br/>人数: <b>' + p.value.toLocaleString() + '</b><br/>转化率: <b>' + p.data.rate + '%</b>',
      },
      color: ['#5B8DEF', '#52C41A', '#FAAD14', '#722ED1'],
      series: [{
        type: 'funnel', left: '10%', width: '70%',
        min: 0, max: s.totalParticipants, minSize: '15%', maxSize: '100%',
        sort: 'descending', gap: 4,
        label: {
          show: true, position: 'right',
          formatter: '{name|{b}}\n{val|{c} 人}  {rate|{@rate}%}',
          rich: {
            name: { fontSize: 13, color: '#374151', fontWeight: 600, lineHeight: 22 },
            val: { fontSize: 14, color: '#111827', fontWeight: 700, lineHeight: 22 },
            rate: { fontSize: 12, color: '#9CA3AF', lineHeight: 22 },
          },
        },
        labelLine: { length: 20, lineStyle: { width: 1, type: 'solid', color: '#E5E7EB' } },
        itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 6 },
        emphasis: { label: { fontSize: 14 }, itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.15)' } },
        data: s.funnel.map(f => ({ value: f.value, name: f.name, rate: f.rate })),
      }] as any[],
    }
  }
  return getActivityFunnelOption()
}

function initFunnel() {
  if (!funnelRef.value) return
  if (funnelChart) funnelChart.dispose()
  funnelChart = echarts.init(funnelRef.value)
  funnelChart.setOption(getFunnelOption())
}

watch(activeSection, (sec) => {
  if (sec === 's6') {
    nextTick(initFunnel)
  }
})

const handleResize = () => funnelChart?.resize()

onMounted(() => {
  window.addEventListener('resize', handleResize)
  store.loadBusinessMetrics()
  nextTick(initFunnel)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  funnelChart?.dispose()
})

// ==================== Section 1 Chart Options ====================
const dauTrendOpt = computed(() =>
  store.dauTrend.length ? buildDauTrendOption(store.dauTrend) : getDauMauOption()
)
const newUserTrendOpt = computed(() =>
  store.newUserTrend.length ? buildNewUserTrendOption(store.newUserTrend) : getNewUserOption()
)
const agentDistOpt = computed(() =>
  store.agentDistribution.length ? buildAgentDistributionOption(store.agentDistribution) : getAgentTypeOption()
)
const downloadPieOpt = computed(() =>
  store.downloadChannelDist.length ? buildDownloadPieOption(store.downloadChannelDist) : getDownloadPieOption()
)
const downloadTrendOpt = computed(() =>
  store.downloadTrend.length ? buildDownloadTrendOption(store.downloadTrend) : getDownloadTrendOption()
)

// ==================== Section 2 Chart Options ====================
function getCapItem(capName: string): number | undefined {
  const items = store.capabilityDistribution?.items
  if (!items) return undefined
  const item = items.find(i => i.capability === capName)
  return item?.callCount
}

const capTrendOpt = computed(() =>
  store.capabilityTrend ? buildCapabilityTrendOption(store.capabilityTrend) : getCapabilityTrendOption()
)
const capPieOpt = computed(() =>
  store.capabilityDistribution ? buildCapabilityPieOption(store.capabilityDistribution) : getCapabilityPieOption()
)
const skillRankOpt = computed(() =>
  store.skillRanking ? buildSkillRankOption(store.skillRanking) : getSkillRankOption()
)

// ==================== Section 4 Chart Options ====================
const sandboxTrendOpt = computed(() =>
  store.sandboxTrend ? buildSandboxTrendOption({
    daily: store.sandboxTrend.daily,
    events: (store.sandboxTrend.events || []).flat(),
  }) : getSandboxTrendOption()
)
const sandboxDurationOpt = computed(() =>
  store.sandboxDuration ? buildSandboxDurationOption(store.sandboxDuration) : getSandboxDurationOption()
)
const sandboxHourlyOpt = computed(() =>
  store.sandboxHourly ? buildSandboxHourlyOption(store.sandboxHourly) : getSandboxHourlyOption()
)

// ==================== Section 5 Chart Options ====================
const voucherTrendOpt = computed(() =>
  store.voucherTrend ? buildVoucherTrendOption(store.voucherTrend) : getVoucherTrendOption()
)
const voucherPieOpt = computed(() =>
  store.voucherDistribution ? buildVoucherPieOption(store.voucherDistribution) : getVoucherPieOption()
)

// ==================== Section 6 Chart Options ====================
const activityTrendOpt = computed(() =>
  store.activityTrend ? buildActivityTrendOption(store.activityTrend) : getActivityTrendOption()
)
const activityConvOpt = computed(() =>
  store.activityConversion ? buildActivityConvOption(store.activityConversion) : getActivityConvOption()
)

function refreshData() {
  refreshing.value = true
  store.loadBusinessMetrics().finally(() => {
    refreshing.value = false
    if (activeSection.value === 's6') {
      nextTick(initFunnel)
    }
    window.dispatchEvent(new Event('resize'))
  })
}
</script>

<style lang="scss">
.sub-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  padding-left: 10px;
  border-left: 3px solid #5b8def;
  margin-bottom: 16px;
  line-height: 1.4;
}

.kpi-badge {
  text-align: right;
  padding-left: 16px;
  border-left: 1px solid #f0f0f0;
  z-index: 2;
  position: relative;

  .badge-label { font-size: 11px; color: #9ca3af; margin-bottom: 2px; }
  .badge-num { font-size: 18px; font-weight: 700; color: #1f2937; line-height: 1.1; }
  .badge-trend {
    font-size: 11px; margin-top: 3px;
    &.up { color: #52c41a; }
    &.down { color: #ff4d4f; }
  }
}

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

.sidebar {
  position: fixed;
  left: 0; top: 0; bottom: 0;
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
}

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

.content { padding: 24px 28px; }

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
}

@media (max-width: 1200px) {
  .chart-row.two, .chart-row.three { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .sidebar { width: 60px; }
  .sidebar-header h1, .nav-item span:not(.icon), .nav-section-title, .sidebar-header .sub { display: none; }
  .main { margin-left: 60px; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
}
</style>
