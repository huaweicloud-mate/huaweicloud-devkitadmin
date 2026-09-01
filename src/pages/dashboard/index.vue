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
          <div class="date-range">📅 数据更新: 2026-09-01 08:00</div>
          <button class="btn-refresh" @click="refreshData" :disabled="refreshing">{{ refreshing ? '🔄 刷新中...' : '🔄 刷新数据' }}</button>
        </div>
      </header>

      <div class="content">
        <!-- ======== Section 1: 业务核心指标 ======== -->
        <section v-if="activeSection === 's1'" class="section">
          <div class="kpi-grid">
            <KpiCard label="开发者总数" value="12,486" trend="↑ 8.3% 较上月" trend-dir="up" accent="blue" icon="👥" />
            <KpiCard label="新增用户（环比）" value="956" trend="↑ 12.5% 环比增长" trend-dir="up" accent="green" icon="➕" />
            <KpiCard label="新增用户（同比）" value="3,241" trend="↑ 45.2% 同比增长" trend-dir="up" accent="orange" icon="📊" />
            <KpiCard label="日活跃数（DAU）" value="3,572" trend="↑ 5.1% 较昨日" trend-dir="up" accent="cyan" icon="☀️" />
            <KpiCard label="月活跃数（MAU）" value="8,934" trend="↑ 9.7% 较上月" trend-dir="up" accent="purple" icon="🌙" />
          </div>
          <div class="chart-row two">
            <ChartCard title="日活 / 月活 趋势（近30天）" :option="dauMauOpt" />
            <ChartCard title="新增用户趋势（环比 vs 同比）" :option="newUserOpt" />
          </div>
          <div class="kpi-grid" style="margin-top:8px">
            <KpiCard label="Agent接入总数" value="4,213" trend="↑ 15.2% 较上月" trend-dir="up" accent="blue" icon="🤖" />
            <KpiCard label="插件总下载量" value="87,562" trend="↑ 22.8% 较上月" trend-dir="up" accent="green" icon="⬇️" />
            <KpiCard label="GitHub 下载/Clone" value="32,104" trend="↑ 18.3% 较上月" trend-dir="up" accent="orange" icon="🐙" />
            <KpiCard label="npm 下载量" value="41,890" trend="↑ 27.1% 较上月" trend-dir="up" accent="cyan" icon="📦" />
            <KpiCard label="市场下载量" value="13,568" trend="↑ 14.6% 较上月" trend-dir="up" accent="purple" icon="🛒" />
          </div>
          <div class="chart-row two">
            <ChartCard title="开发者Agent接入数量（按种类分布）" desc="不同类型Agent的接入数量占比" :option="agentTypeOpt" />
            <ChartCard title="插件下载量趋势（GitHub / npm）" desc="每日拉取一次，展示近30天各渠道下载量趋势" :option="downloadTrendOpt" />
          </div>
          <div class="chart-row one-half">
            <ChartCard title="GitHub & npm 每日下载量明细" desc="每日拉取一次数据，展示双渠道日粒度下载对比" :option="ghNpmOpt" :height="280" />
            <ChartCard title="下载渠道占比" desc="GitHub / npm / 市场 三渠道占比" :option="downloadPieOpt" :height="280" />
          </div>
        </section>

        <!-- ======== Section 2: 开放能力 ======== -->
        <section v-if="activeSection === 's2'" class="section">
          <div class="kpi-grid">
            <KpiCard label="Skill 调用总次数" value="156,832" trend="↑ 18.4% 较上周" trend-dir="up" accent="blue" icon="🛠️" />
            <KpiCard label="MCP 调用总次数" value="89,241" trend="↑ 22.1% 较上周" trend-dir="up" accent="green" icon="🔗" />
            <KpiCard label="开放能力调用总次数" value="132,808" trend="↑ 15.6% 较上周" trend-dir="up" accent="orange" icon="⚡" />
          </div>
          <div class="chart-row two">
            <ChartCard title="调用次数趋势（Skill / MCP / 开放能力）" desc="近14天 Skill调用、MCP调用、开放能力调用次数趋势" :option="capTrendOpt" />
            <ChartCard title="开放能力调用占比分布" desc="MCP / CLI / Skill 调用占比，API / SDK / TF 暂无支持" :option="capPieOpt" />
          </div>
          <div class="chart-row one">
            <ChartCard title="Skill 明细调用排行（Top 10）" desc="通过插件调用各Skill的次数排行" :option="skillRankOpt" :height="320" />
          </div>
          <div class="chart-row one">
            <div class="chart-card">
              <div class="chart-title">用户明细</div>
              <div class="chart-desc">可搜索用户列表，查看单个用户的部署历史与代金券领取记录</div>
              <div class="search-bar">
                <input type="text" class="search-input" placeholder="搜索 domainId..." v-model="searchQuery" @keyup.enter="filterUsers" />
                <select class="filter-select" v-model="filterStatus">
                  <option value="">全部状态</option>
                  <option value="active">活跃</option>
                  <option value="low">低活跃</option>
                  <option value="churned">流失</option>
                </select>
              </div>
              <div class="table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>domainId</th><th>Agent接入数</th><th>部署次数</th><th>状态</th><th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="u in filteredUsers" :key="u.id">
                      <td>{{ u.id }}</td><td>{{ u.agentCount }}</td><td>{{ u.deployCount }}</td>
                      <td><span class="tag" :class="statusTagMap[u.status]">{{ statusLabelMap[u.status] }}</span></td>
                      <td><a href="javascript:void(0)" class="detail-link" @click="openUserDetail(u.id)">查看详情</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="info-note">💡 点击「查看详情」可查看该用户的完整部署历史记录与代金券领取明细</div>
            </div>
          </div>
        </section>

        <!-- ======== Section 3: 插件开源运营 ======== -->
        <section v-if="activeSection === 's3'" class="section">
          <div class="kpi-grid">
            <KpiCard label="开源贡献者数" value="47" trend="↑ 6 本月新增" trend-dir="up" accent="blue" icon="🐙" />
            <KpiCard label="开源仓下载数" value="32,104" trend="↑ 18.3% 较上月" trend-dir="up" accent="green" icon="⬇️" />
            <KpiCard label="Star 数" value="1,256" trend="↑ 89 本月新增" trend-dir="up" accent="orange" icon="⭐" />
            <KpiCard label="已发布版本数" value="24" trend="最新: v2.4.1" trend-dir="flat" accent="purple" icon="🏷️" />
            <KpiCard label="当前版本" value="v2.4.1" trend="发布于 2026-08-28" trend-dir="flat" accent="cyan" icon="📌" />
          </div>
          <div class="chart-row two">
            <ChartCard title="Star 数 & 下载量增长趋势" desc="近6个月 GitHub Star 数与仓库下载量增长趋势" :option="starTrendOpt" />
            <ChartCard title="贡献者活跃度" desc="近3个月贡献者提交（Commit / PR / Issue）活跃度" :option="contributorOpt" />
          </div>
          <div class="chart-row one">
            <div class="chart-card">
              <div class="chart-title">版本发布历史</div>
              <div class="chart-desc">插件已发布版本记录</div>
              <ul class="version-list" style="padding:8px 0;">
                <li v-for="v in versions" :key="v.num" class="version-item">
                  <div class="version-dot" :style="{ background: v.num === 'v2.4.1' ? '#52C41A' : v.num === 'v2.4.0' ? '#5B8DEF' : '#9CA3AF' }"></div>
                  <div class="version-info">
                    <div class="ver-num">{{ v.num }}</div>
                    <div class="ver-date">{{ v.date }}</div>
                    <div class="ver-note">{{ v.note }}</div>
                  </div>
                  <span v-if="v.num === 'v2.4.1'" class="version-tag">当前版本</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- ======== Section 4: 沙箱资源信息 ======== -->
        <section v-if="activeSection === 's4'" class="section">
          <div class="kpi-grid">
            <KpiCard label="总拉取沙箱次数" value="234,567" trend="↑ 累计总量" trend-dir="up" accent="blue" icon="📦" />
            <KpiCard label="今日拉取次数" value="1,823" trend="↑ 7.2% 较昨日" trend-dir="up" accent="green" icon="📅" />
            <KpiCard label="平均创建耗时" value="8.2" unit="秒" trend="↓ 1.3s 优化" trend-dir="down" accent="orange" icon="⏱️" />
            <KpiCard label="P95 创建耗时" value="15.6" unit="秒" trend="SLA: <20s" trend-dir="flat" accent="purple" icon="📈" />
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
            <KpiCard label="已领取总人数" value="5,672" trend="↑ 累计总量" trend-dir="up" accent="blue" icon="👥" />
            <KpiCard label="代金券总发放金额" value="¥283,600" trend="↑ 累计总额" trend-dir="up" accent="green" icon="💰" />
            <KpiCard label="今日领取人数" value="128" trend="↑ 15.2% 较昨日" trend-dir="up" accent="orange" icon="📅" />
            <KpiCard label="今日发放金额" value="¥6,400" trend="↑ 12.8% 较昨日" trend-dir="up" accent="cyan" icon="💵" />
            <KpiCard label="本月领取人数" value="2,134" trend="↑ 22.1% 环比" trend-dir="up" accent="purple" icon="🌙" />
            <KpiCard label="本月发放金额" value="¥106,700" trend="↑ 18.5% 环比" trend-dir="up" accent="red" icon="💴" />
          </div>
          <div class="chart-row two">
            <ChartCard title="代金券领取趋势（近30天）" desc="每日领取人数与发放金额趋势" :option="voucherTrendOpt" />
            <ChartCard title="代金券面额分布" desc="不同面额代金券的领取占比" :option="voucherPieOpt" />
          </div>
          <div class="chart-row one">
            <div class="chart-card">
              <div class="chart-title">代金券领取明细</div>
              <div class="chart-desc">最近领取记录明细</div>
              <div class="table-wrap">
                <table class="data-table">
                  <thead>
                    <tr><th>记录ID</th><th>domainId</th><th>面额</th><th>领取时间</th><th>来源活动</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in voucherRecords" :key="r.id">
                      <td>{{ r.id }}</td><td>{{ r.domainId }}</td><td>{{ r.amount }}</td><td>{{ r.time }}</td><td>{{ r.source }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <!-- ======== Section 6: 活动统计 ======== -->
        <section v-if="activeSection === 's6'" class="section">
          <div class="kpi-grid">
            <KpiCard label="参与总人数" value="8,421" trend="↑ 活动进行中" trend-dir="up" accent="blue" icon="🎯" />
            <KpiCard label="初章完成人数" value="5,234" trend="完成率 62.2%" trend-dir="flat" accent="green" icon="📖" />
            <KpiCard label="第二章完成人数" value="2,876" trend="完成率 34.2%" trend-dir="flat" accent="orange" icon="📚" />
            <KpiCard label="终章完成人数" value="1,423" trend="完成率 16.9%" trend-dir="flat" accent="purple" icon="🏆" />
          </div>
          <div class="chart-row one">
            <div class="chart-card">
              <div class="chart-title">活动转化漏斗</div>
              <div class="chart-desc">参与 → 初章完成 → 第二章完成 → 终章完成 各阶段转化率分析</div>
              <div ref="funnelRef" :style="{ height: '380px' }"></div>
              <AlertBanner
                style="margin-top:12px"
                title="转化分析"
                text="初章→第二章流失率最高（27.9%），建议优化第二章任务难度或增加引导。终章完成率16.9%仍有提升空间。"
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

    <UserDetailModal :visible="modalVisible" :user-id="selectedUserId" @close="modalVisible = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import KpiCard from './components/KpiCard.vue'
import ChartCard from './components/ChartCard.vue'
import AlertBanner from './components/AlertBanner.vue'
import UserDetailModal from './components/UserDetailModal.vue'
import { users } from './data/charts'
import {
  getDauMauOption, getNewUserOption, getAgentTypeOption, getDownloadTrendOption,
  getGhNpmDailyOption, getDownloadPieOption,
  getCapabilityTrendOption, getCapabilityPieOption, getSkillRankOption,
  getStarTrendOption, getContributorOption,
  getSandboxTrendOption, getSandboxDurationOption, getSandboxHourlyOption,
  getVoucherTrendOption, getVoucherPieOption,
  getActivityFunnelOption, getActivityTrendOption, getActivityConvOption,
} from './data/charts'

const activeSection = ref('s6')

const navItems = [
  { key: 's1', icon: '📈', label: '业务核心指标', badge: '' },
  { key: 's2', icon: '🔌', label: '开放能力', badge: '' },
  { key: 's3', icon: '📦', label: '插件开源运营', badge: '' },
  { key: 's4', icon: '🖥️', label: '沙箱资源信息', badge: '' },
  { key: 's5', icon: '🎫', label: '代金券资源', badge: '' },
  { key: 's6', icon: '🎯', label: '活动统计', badge: '' },
]

const titleMap: Record<string, string> = {
  s1: '业务核心指标', s2: '开放能力', s3: '插件开源运营信息',
  s4: '沙箱资源信息', s5: '代金券资源信息', s6: '活动统计信息',
}

const currentTitle = computed(() => titleMap[activeSection.value] || '运营看板')
const refreshing = ref(false)

// Search & filter
const searchQuery = ref('')
const filterStatus = ref('')
const statusTagMap: Record<string, string> = { active: 'tag-green', low: 'tag-orange', churned: 'tag-gray' }
const statusLabelMap: Record<string, string> = { active: '活跃', low: '低活跃', churned: '流失' }

const filteredUsers = computed(() => {
  let list = users
  if (searchQuery.value) {
    const kw = searchQuery.value.toLowerCase()
    list = list.filter(u => u.id.toLowerCase().includes(kw) || u.name.toLowerCase().includes(kw))
  }
  if (filterStatus.value) {
    list = list.filter(u => u.status === filterStatus.value)
  }
  return list
})

function filterUsers() {
  // computed already handles this
}

// User modal
const modalVisible = ref(false)
const selectedUserId = ref<string | null>(null)
function openUserDetail(id: string) {
  selectedUserId.value = id
  modalVisible.value = true
}

// Funnel chart (special case)
const funnelRef = ref<HTMLDivElement>()
let funnelChart: echarts.ECharts | null = null

function initFunnel() {
  if (!funnelRef.value) return
  if (funnelChart) funnelChart.dispose()
  funnelChart = echarts.init(funnelRef.value)
  funnelChart.setOption(getActivityFunnelOption())
}

watch(activeSection, (sec) => {
  if (sec === 's6') {
    nextTick(initFunnel)
  }
})

const handleResize = () => funnelChart?.resize()

onMounted(() => {
  nextTick(initFunnel)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  funnelChart?.dispose()
})

// Chart options
const dauMauOpt = getDauMauOption()
const newUserOpt = getNewUserOption()
const agentTypeOpt = getAgentTypeOption()
const downloadTrendOpt = getDownloadTrendOption()
const ghNpmOpt = getGhNpmDailyOption()
const downloadPieOpt = getDownloadPieOption()

const capTrendOpt = getCapabilityTrendOption()
const capPieOpt = getCapabilityPieOption()
const skillRankOpt = getSkillRankOption()

const starTrendOpt = getStarTrendOption()
const contributorOpt = getContributorOption()

const sandboxTrendOpt = getSandboxTrendOption()
const sandboxDurationOpt = getSandboxDurationOption()
const sandboxHourlyOpt = getSandboxHourlyOption()

const voucherTrendOpt = getVoucherTrendOption()
const voucherPieOpt = getVoucherPieOption()

const activityTrendOpt = getActivityTrendOption()
const activityConvOpt = getActivityConvOption()

// Version list
const versions = [
  { num: 'v2.4.1', date: '2026-08-28', note: '修复沙箱创建超时问题，优化MCP调用性能' },
  { num: 'v2.4.0', date: '2026-08-15', note: '新增 TF 开放能力支持（Beta），Skill调用链路优化' },
  { num: 'v2.3.2', date: '2026-07-30', note: '代金券领取流程优化，修复用户明细搜索bug' },
  { num: 'v2.3.1', date: '2026-07-12', note: 'CLI 调用稳定性增强，新增活动统计接口' },
  { num: 'v2.3.0', date: '2026-06-25', note: '支持市场渠道分发，Agent接入流程重构' },
  { num: 'v2.2.0', date: '2026-06-01', note: 'Hook 机制上线（部分Agent支持），沙箱资源池扩容' },
]

// Voucher records
const voucherRecords = [
  { id: 'V-20260901-001', domainId: 'U-10032', amount: '¥500', time: '2026-09-01 07:45', source: '新手活动' },
  { id: 'V-20260901-002', domainId: 'U-10045', amount: '¥200', time: '2026-09-01 07:30', source: '签到奖励' },
  { id: 'V-20260901-003', domainId: 'U-10078', amount: '¥1,000', time: '2026-09-01 06:20', source: '活动终章完成' },
  { id: 'V-20260831-088', domainId: 'U-10102', amount: '¥100', time: '2026-08-31 22:15', source: '新手活动' },
  { id: 'V-20260831-076', domainId: 'U-10135', amount: '¥50', time: '2026-08-31 18:40', source: '签到奖励' },
  { id: 'V-20260831-065', domainId: 'U-10189', amount: '¥800', time: '2026-08-31 15:22', source: '活动第二章完成' },
  { id: 'V-20260831-051', domainId: 'U-10203', amount: '¥200', time: '2026-08-31 12:08', source: '新手活动' },
  { id: 'V-20260830-043', domainId: 'U-10167', amount: '¥50', time: '2026-08-30 10:35', source: '签到奖励' },
]

function refreshData() {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    window.dispatchEvent(new Event('resize'))
  }, 800)
}
</script>

<style lang="scss">
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

// Version list
.version-list { list-style: none; }
.version-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}
.version-item:last-child { border-bottom: none; }
.version-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.version-info { flex: 1; }
.version-info .ver-num { font-size: 13px; font-weight: 600; }
.version-info .ver-date { font-size: 11px; color: #9ca3af; }
.version-info .ver-note { font-size: 11px; color: #6b7280; margin-top: 2px; }
.version-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #d1fae5;
  color: #065f46;
  font-weight: 600;
}

// Search
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  align-items: center;
}
.search-input {
  flex: 1;
  max-width: 320px;
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #5b8def; }
.filter-select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  background: #fff;
  cursor: pointer;
  outline: none;
}

// Info note
.info-note {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 8px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

// Table
.table-wrap { overflow-x: auto; border-radius: 8px; }
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th {
    background: #f8fafc;
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    color: #6b7280;
    border-bottom: 2px solid #e5e7eb;
    white-space: nowrap;
  }

  td {
    padding: 10px 14px;
    border-bottom: 1px solid #e5e7eb;
    color: #1f2937;
  }

  tr:hover td { background: #f8fafc; }
}

// Tags
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}
.tag-green { background: #d1fae5; color: #065f46; }
.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-orange { background: #fef3c7; color: #92400e; }
.tag-red { background: #fee2e2; color: #991b1b; }
.tag-gray { background: #f3f4f6; color: #4b5563; }

.detail-link { color: #5b8def; text-decoration: none; }
.detail-link:hover { text-decoration: underline; }
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