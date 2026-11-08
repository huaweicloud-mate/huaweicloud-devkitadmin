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
          <div v-if="store.realtimeError" class="realtime-error">⚠ {{ store.realtimeError }}</div>
          <div class="range-switch" role="group" aria-label="数据口径切换">
            <button
              type="button"
              :class="{ active: !isRealtime }"
              :disabled="store.loading"
              @click="store.setDateRange('yesterday')"
            >前一天</button>
            <button
              type="button"
              :class="{ active: isRealtime }"
              :disabled="store.loading"
              @click="store.setDateRange('realtime')"
            >当天实时</button>
          </div>
          <div class="date-range">
            <template v-if="isRealtime">⚡ 当天实时{{ store.computedAt ? `（计算于 ${store.computedAt}）` : '' }} · 每 {{ store.refreshIntervalMinutes }} 分钟自动刷新</template>
            <template v-else>📅 数据截至昨日（{{ updateDate }}）</template>
          </div>
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
                  <div class="badge-trend up">↑ {{ store.developerSummary?.newUsersGrowthRate != null ? Math.round(store.developerSummary.newUsersGrowthRate) : '--' }}%</div>
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
              :trend="`${dayWord}活跃`"
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
            <ChartCard title="Agent 接入数量Top15（按种类分布）" desc="按Agent名称合并统计（不区分平台，屏蔽test开头，仅展示Top15）" :option="agentDistOpt" :height="320" />
            <ChartCard title="devkit 客户端版本分布（Top20）" desc="按用户使用的客户端版本（plugin_version）去重用户统计" :option="versionDistOpt" :height="320" />
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
            <KpiCard label="Skill 调用总次数" :value="fmt(store.capabilitySummary?.skillCalls)" trend="累计调用" trend-dir="up" accent="green" icon="🔗" />
            <KpiCard label="MCP 调用总次数" :value="fmt(store.capabilitySummary?.mcpCalls)" trend="累计调用" trend-dir="up" accent="orange" icon="⚡" />
            <KpiCard label="CLI 调用总次数" :value="fmt(store.capabilitySummary?.cliCalls)" trend="累计调用" trend-dir="up" accent="orange" icon="🔧" />
          </div>
          <div class="chart-row two">
            <ChartCard title="调用次数趋势（Skill / MCP / CLI）" desc="近14天 Skill调用、MCP调用、CLI调用次数趋势" :option="capTrendOpt" />
            <ChartCard title="开放能力调用占比分布" desc="Skill / MCP / CLI 累计调用占比" :option="capPieOpt" />
          </div>
          <div class="chart-row one">
            <ChartCard title="Skill 明细调用排行（Top 10）" desc="通过插件调用各Skill的次数排行" :option="skillRankOpt" :height="320" />
          </div>
        </section>

                <!-- ======== Section 2.5: 服务健康（#120） ======== -->
        <section v-if="activeSection === 's2h'" class="section">
          <div class="sub-section-title">服务健康</div>
          <div class="kpi-grid">
            <KpiCard label="昨日总调用" :value="fmt(store.healthSummary?.yesterday?.totalCalls)" trend="截至昨日" trend-dir="up" accent="blue" icon="📡" />
            <KpiCard label="昨日错误率" :value="store.healthSummary?.yesterday?.errorRatePct != null ? store.healthSummary.yesterday.errorRatePct.toFixed(2) + '%' : '--'" trend="含 4xx + 5xx" trend-dir="flat" accent="orange" icon="⚠️" />
            <KpiCard label="昨日 5xx" :value="fmt(store.healthSummary?.yesterday?.serverErrorCalls)" trend="服务端错误" trend-dir="down" accent="red" icon="🔴" />
            <KpiCard label="今日调用" :value="fmt(store.healthSummary?.today?.totalCalls)" trend="截至当前" trend-dir="up" accent="green" icon="📈" />
          </div>
          <div class="chart-row two">
            <ChartCard title="近 7 天调用量与错误率趋势" desc="入站 API 调用量（蓝）与错误率%（红）双轴趋势" :option="healthTrendOpt" :height="300" />
            <ChartCard title="错误码 Top10" desc="含 4xx/5xx/业务错误码，按出现次数排行" :option="healthErrorTopOpt" :height="300" />
          </div>
          <div class="chart-row one">
            <ChartCard title="慢接口 Top10" desc="按 p95 耗时降序排列（毫秒）" :option="healthSlowTopOpt" :height="320" />
          </div>
        </section>

        <!-- ======== Section 3: 插件开源运营 ======== -->
        <section v-if="activeSection === 's3'" class="section">
          <div class="kpi-grid">
            <KpiCard
              label="Star 数"
              :value="fmt(store.openSourceSummary?.stars)"
              :trend="`↑ ${weekStarDelta} 本周`"
              trend-dir="up"
              accent="blue"
              icon="⭐"
            />
            <KpiCard
              label="Fork 数"
              :value="fmt(store.openSourceSummary?.forks)"
              trend="累计总量"
              trend-dir="up"
              accent="green"
              icon="🍴"
            />
            <KpiCard
              label="已发布版本数"
              :value="fmt(store.openSourceSummary?.releases)"
              :trend="store.openSourceSummary?.latestVersion ? `最新: ${store.openSourceSummary.latestVersion}` : '--'"
              trend-dir="flat"
              accent="orange"
              icon="🚀"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="Star 数 & 下载量趋势" desc="GitHub Star 数与 npm 日下载量（数据截至昨日）" :option="starDownloadTrendOpt" :height="320" />
            <div class="chart-card">
              <div class="chart-title">版本发布历史 <span style="font-size:11px;color:#9CA3AF;font-weight:400">npm 口径</span></div>
              <div class="chart-desc">npm 口径 · 发布期间累计（近似）</div>
              <div class="release-list">
                <div v-if="!store.openSourceReleases?.length" class="release-empty">暂无版本发布数据</div>
                <div v-for="r in store.openSourceReleases" :key="r.tagName" class="release-item">
                  <div class="release-tag">{{ r.tagName }}</div>
                  <div class="release-name">{{ r.name || r.tagName }}</div>
                  <div class="release-date">{{ r.publishedDate }}</div>
                  <div class="release-dl">{{ r.downloadCount != null ? fmt(r.downloadCount) + " 次下载" : "--" }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-row one">
            <ChartCard title="贡献者活跃（近 3 个月）" desc="贡献者 Commit / PR / Issue 数量统计" :option="contributorActivityOpt" :height="260" />
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
              :label="`${dayWord}沙箱用户数`"
              :value="fmt(store.sandboxSummary?.dailyUsers)"
              :trend="`↑ ${store.sandboxSummary?.dailyUsersChainRatio != null ? Math.round(store.sandboxSummary.dailyUsersChainRatio) : '--'}% 较前日`"
              trend-dir="up"
              accent="green"
              icon="📅"
            />
            <KpiCard
              label="平均拉起耗时"
              :value="avgDurationText"
              unit="秒"
              :trend="avgDurationTrend"
              :trend-dir="avgDurationTrendDir"
              accent="orange"
              icon="⏱️"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="沙箱用户数趋势（近30天）" desc="每日沙箱去重用户数与事件总次数趋势" :option="sandboxTrendOpt" />
            <ChartCard title="沙箱拉起耗时分布（近30天）" desc="近30天拉起耗时区间分布（秒），监控性能瓶颈" :option="sandboxDurationOpt" />
          </div>
          <div class="chart-row one">
            <ChartCard :title="`每小时沙箱用户数（${dayWord}）`" :desc="`${dayWord}各时段沙箱去重用户数分布，识别使用高峰`" :option="sandboxHourlyOpt" :height="260" />
          </div>

          <!-- ======== 沙箱观测（Issue #134，#121 后端 30 天固定窗口） ======== -->
          <div class="sub-section-title" style="margin-top:24px">沙箱观测（近 30 天）</div>
          <div class="chart-row two">
            <ChartCard
              title="沙箱复连间隔分布"
              desc="同沙箱相邻成功 connect 事件间隔分布（connect 事件近似口径），p50/p90 虚线标注"
              :option="sandboxRevisitOpt"
              :height="300"
            />
            <ChartCard
              title="沙箱闲置时长分布"
              desc="去重沙箱距最后成功 connect 的闲置时长分布（按用户最后使用时间统计，非实时状态），&gt;24h 橙色 / &gt;72h 红色高亮"
              :option="sandboxIdleOpt"
              :height="300"
            />
          </div>
          <div class="chart-row two">
            <ChartCard
              title="沙箱建连成功率趋势"
              :desc="`connect 失败次数与成功率逐日趋势（近 30 天）· 失败率 ${failRateText}`"
              :option="sandboxErrorTrendOpt"
              :height="300"
            />
            <ChartCard
              title="沙箱错误码 Top10"
              desc="近 30 天 connect 失败 error_code 次数排行"
              :option="sandboxErrorCodeOpt"
              :height="300"
            />
          </div>
          <div class="chart-row one">
            <ChartCard
              title="沙箱成本拆分（template × flavor）"
              desc="近 30 天 create 次数 Top10（组合键 template_id·flavor_id，悬停查看去重用户数）"
              :option="sandboxCostOpt"
              :height="320"
            />
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
              :label="`${dayWord}领取人数`"
              :value="fmt(store.voucherSummary?.yesterdayCount)"
              :trend="`↑ ${store.voucherSummary?.yesterdayCountChainRatio != null ? Math.round(store.voucherSummary.yesterdayCountChainRatio) : '--'}% 较前日`"
              trend-dir="up"
              accent="orange"
              icon="📅"
            />
            <KpiCard
              :label="`${dayWord}发放金额`"
              :value="fmtYuanWithSymbol(store.voucherSummary?.yesterdayAmount)"
              :trend="`↑ ${store.voucherSummary?.yesterdayAmountChainRatio != null ? Math.round(store.voucherSummary.yesterdayAmountChainRatio) : '--'}% 较前日`"
              trend-dir="up"
              accent="cyan"
              icon="💵"
            />
            <KpiCard
              label="本月领取人数"
              :value="fmt(store.voucherSummary?.monthCount)"
              :trend="`↑ ${store.voucherSummary?.monthCountChainRatio != null ? Math.round(store.voucherSummary.monthCountChainRatio) : '--'}% 环比`"
              trend-dir="up"
              accent="purple"
              icon="🌙"
            />
            <KpiCard
              label="本月发放金额"
              :value="fmtYuanWithSymbol(store.voucherSummary?.monthAmount)"
              :trend="`↑ ${store.voucherSummary?.monthAmountChainRatio != null ? Math.round(store.voucherSummary.monthAmountChainRatio) : '--'}% 环比`"
              trend-dir="up"
              accent="red"
              icon="💴"
            />
          </div>
          <div class="chart-row two">
            <ChartCard title="代金券领取趋势（近30天）" desc="每日领取人数与发放金额趋势" :option="voucherTrendOpt" />
            <ChartCard title="代金券面额分布（本月）" desc="本月不同面额代金券的领取占比" :option="voucherPieOpt" />
          </div>
        </section>

        <!-- ======== Section 6: 活动统计 ======== -->
        <section v-if="activeSection === 's6'" class="section">
          <div class="sub-section-title" style="display:flex;align-items:center;gap:12px">
            <span>活动统计</span>
          </div>
          <!-- Issue #119：活动多选（自动发现 + 名称覆盖 + 全部汇总兜底） -->
          <div class="activity-toolbar">
            <div class="activity-select" :class="{ open: activityDropdownOpen }">
              <button class="activity-select-btn" type="button" @click="activityDropdownOpen = !activityDropdownOpen">
                <span class="activity-select-label">{{ activitySelectionLabel }}</span>
                <span class="activity-select-arrow">{{ activityDropdownOpen ? '▴' : '▾' }}</span>
              </button>
            </div>
            <div v-if="activityDropdownOpen" class="activity-select-backdrop" @click="activityDropdownOpen = false"></div>
            <div v-if="activityDropdownOpen" class="activity-select-panel">
              <label class="activity-option" :class="{ checked: isAllActivitySelected }">
                <input
                  type="checkbox"
                  :checked="isAllActivitySelected"
                  @change="toggleAllActivity"
                />
                <span class="activity-option-name">全部活动·汇总</span>
              </label>
              <label
                v-for="a in store.activityList"
                :key="a.code"
                class="activity-option"
                :class="{ checked: isActivityCodeSelected(a.code) }"
              >
                <input
                  type="checkbox"
                  :checked="isActivityCodeSelected(a.code)"
                  @change="toggleActivityCode(a.code)"
                />
                <span class="activity-option-name">{{ a.name }}</span>
                <span class="activity-option-date">{{ a.latest_snapshot_date || '暂无快照' }}</span>
              </label>
              <div v-if="!store.activityList.length" class="activity-option-empty">暂无活动快照数据</div>
            </div>
          </div>

          <!-- 多选：顶部汇总行（跨活动求和口径） -->
          <div v-if="store.isActivityMulti" class="all-summary-row">
            <div class="all-summary-title">Σ 全部活动汇总（{{ store.selectedActivityItems.length }} 个活动求和）</div>
            <div class="all-summary-metrics">
              <span>参与 <b>{{ fmt(allActivitySummary?.totalParticipants) }}</b></span>
              <span v-for="st in (allActivitySummary?.stages ?? [])" :key="st.key">{{ st.label }}完成 <b>{{ fmt(st.value) }}</b>（{{ rateText(st.rate) }}）</span>
            </div>
            <div class="all-summary-note">⚠ {{ multiSumNote }}</div>
          </div>

          <!-- KPI：多选并列对比；单选与现状一致 -->
          <template v-if="store.isActivityMulti">
            <div v-for="item in store.selectedActivityItems" :key="item.code" class="activity-kpi-group">
              <div class="sub-section-title">{{ item.name }}</div>
              <div class="kpi-grid">
                <KpiCard
                  label="参与总人数"
                  :value="fmt(item.summary?.totalParticipants)"
                  trend="↑ 活动进行中"
                  trend-dir="up"
                  accent="blue"
                  icon="🎯"
                />
                <KpiCard
                  v-for="(st, i) in (item.summary?.stages ?? [])"
                  :key="st.key"
                  :label="`${st.label}完成人数`"
                  :value="fmt(st.value)"
                  :trend="`完成率 ${rateText(st.rate)}`"
                  trend-dir="flat"
                  :accent="activityStageStyle(i).accent"
                  :icon="activityStageStyle(i).icon"
                />
              </div>
            </div>
          </template>
          <div v-else class="kpi-grid">
            <KpiCard
              label="参与总人数"
              :value="fmt(store.activitySummary?.totalParticipants)"
              trend="↑ 活动进行中"
              trend-dir="up"
              accent="blue"
              icon="🎯"
            />
            <KpiCard
              v-for="(st, i) in (store.activitySummary?.stages ?? [])"
              :key="st.key"
              :label="`${st.label}完成人数`"
              :value="fmt(st.value)"
              :trend="`完成率 ${rateText(st.rate)}`"
              trend-dir="flat"
              :accent="activityStageStyle(i).accent"
              :icon="activityStageStyle(i).icon"
            />
          </div>

          <!-- 漏斗：多选并排；单选保持现状 -->
          <template v-if="store.isActivityMulti">
            <div class="chart-row two">
              <ChartCard
                v-for="item in store.selectedActivityItems"
                :key="item.code"
                :title="`活动转化漏斗 · ${item.name}`"
                :desc="funnelDescFor(item)"
                :option="activityItemFunnelOpt(item)"
                :height="360"
              />
            </div>
          </template>
          <div v-else class="chart-row one">
            <div class="chart-card">
              <div class="chart-title">活动转化漏斗</div>
              <div class="chart-desc">{{ funnelDescFor(null) }}</div>
              <div ref="funnelRef" :style="{ height: '380px' }"></div>
              <AlertBanner
                style="margin-top:12px"
                title="转化分析"
                :text="funnelAlertText"
              />
            </div>
          </div>
          <div class="chart-row two">
            <ChartCard title="各阶段每日完成人数趋势" desc="近14天各章节每日完成人数趋势（多活动多线对比）" :option="activityTrendOpt" />
            <template v-if="store.isActivityMulti">
              <ChartCard
                v-for="item in store.selectedActivityItems"
                :key="'conv-' + item.code"
                title="各阶段转化率对比"
                :desc="`阶段间转化率 · ${item.name}`"
                :option="activityItemConvOpt(item)"
              />
            </template>
            <ChartCard v-else title="各阶段转化率对比" desc="阶段间转化率与整体转化率分析" :option="activityConvOpt" />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import KpiCard from './components/KpiCard.vue'
import ChartCard from './components/ChartCard.vue'
import AlertBanner from './components/AlertBanner.vue'
import { useDashboardStore, fmtYuanWithSymbol } from '@/store/dashboard'
import { ALL_ACTIVITY_CODE, MULTI_SUM_NOTE } from './data/activity-config'
import type { ActivityStatsItem } from '@/api/activity'
import {
  getEmptyChartOption,
  buildDauTrendOption, buildAgentDistributionOption, buildVersionDistributionOption, buildNewUserTrendOption,
  buildDownloadPieOption, buildDownloadTrendOption,
  buildCapabilityTrendOption, buildCapabilityPieOption, buildSkillRankOption,
  buildSandboxTrendOption, buildSandboxDurationOption, buildSandboxHourlyOption,
  buildSandboxRevisitIntervalOption, buildSandboxIdleOption,
  buildHealthTrendOption, buildHealthErrorTopOption, buildHealthSlowTopOption,
  buildSandboxErrorTrendOption, buildSandboxErrorCodeOption, buildSandboxCostOption,
  buildVoucherTrendOption, buildVoucherPieOption,
  buildActivityFunnelOption, buildActivityTrendOption, buildActivityTrendMultiOption, buildActivityConvOption,
  buildStarDownloadTrendOption, buildContributorActivityOption,
} from './data/charts'

const store = useDashboardStore()

/** 组件卸载时停止实时自动刷新定时器，避免泄漏 */
onUnmounted(() => {
  store.stopAutoRefresh()
})

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
  { key: 's1', icon: '👥', label: '业务核心指标', badge: '' },
  { key: 's2', icon: '🛠️', label: '开放能力', badge: '' },
  { key: 's2h', icon: '🩺', label: '服务健康', badge: '' },
  { key: 's3', icon: '⭐', label: '插件开源运营', badge: '' },
  { key: 's4', icon: '📦', label: '沙箱资源信息', badge: '' },
  { key: 's5', icon: '💰', label: '代金券资源', badge: '' },
  { key: 's6', icon: '🎯', label: '活动统计', badge: '' },
]

const titleMap: Record<string, string> = {
  s1: '业务核心指标', s2: '开放能力', s3: '插件开源运营',
  s4: '沙箱资源信息', s5: '代金券资源信息', s6: '活动统计信息',
}

const currentTitle = computed(() => titleMap[activeSection.value] || '运营看板')

/** 数据口径：前一天（T-1，默认）/ 当天实时 */
const isRealtime = computed(() => store.dateRange === 'realtime')
/** 随口径切换的“日”措辞：昨日 / 当天 */
const dayWord = computed(() => (isRealtime.value ? '当天' : '昨日'))

/** 看板数据为 T-1 口径时，头部展示昨日日期 */
const updateDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// Funnel chart (special case — manual echarts.init, not ChartCard :option)
const funnelRef = ref<HTMLDivElement>()
let funnelChart: echarts.ECharts | null = null

// ==================== 板块三：插件开源运营 ====================

const weekStarDelta = computed(() => {
  const trend = store.openSourceSummary?.starTrend
  if (!trend || trend.length < 8) return 0
  const latest = trend[trend.length - 1].stars
  const weekAgo = trend[trend.length - 8].stars
  return latest - weekAgo
})

const starDownloadTrendOpt = computed(() =>
  store.openSourceSummary?.starTrend?.length
    ? buildStarDownloadTrendOption(
        store.openSourceSummary.starTrend.map((t, i) => ({
          date: t.date,
          stars: t.stars,
          downloads: store.openSourceSummary?.downloadTrend?.[i]?.downloads ?? 0,
        })),
      )
    : getEmptyChartOption()
)

const contributorActivityOpt = computed(() =>
  store.openSourceContributors?.length
    ? buildContributorActivityOption(store.openSourceContributors)
    : getEmptyChartOption()
)

// Activity computed options
const activityFunnelOpt = computed(() =>
  store.activitySummary?.stages?.length
    ? buildActivityFunnelOption(
        store.activitySummary.stages.map(s => ({ name: s.label, value: s.value, rate: s.rate })),
      )
    : getEmptyChartOption()
)

const funnelAlertText = computed(() => {
  const s = store.activitySummary
  const conv = store.activityConversion?.stages ?? []
  if (!s || s.totalParticipants === 0) return '暂无活动数据'
  if (!conv.length) return '暂无活动数据'
  let maxDrop = { label: '', rate: Number.NEGATIVE_INFINITY }
  for (const c of conv) {
    const drop = 100 - c.rate
    if (drop > maxDrop.rate) maxDrop = { label: c.label, rate: drop }
  }
  return `${maxDrop.label}流失率最高（${Math.round(maxDrop.rate)}%），建议优化该环节任务难度或增加引导。`
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

// ==================== 板块六：活动统计（Issue #119 多选对比） ====================

const activityDropdownOpen = ref(false)
const multiSumNote = MULTI_SUM_NOTE

const isAllActivitySelected = computed(() =>
  store.selectedActivityCodes.includes(ALL_ACTIVITY_CODE),
)

const isActivityCodeSelected = (code: string) =>
  !isAllActivitySelected.value && store.selectedActivityCodes.includes(code)

const activitySelectionLabel = computed(() => {
  if (isAllActivitySelected.value) return '全部活动·汇总'
  if (!store.selectedActivityCodes.length) return '未选择活动'
  const first = store.selectedActivityCodes[0]
  return store.selectedActivityCodes.length === 1
    ? store.activityNameOf(first)
    : `已选 ${store.selectedActivityCodes.length} 个活动`
})

/** 汇总行数据（多选时取 all 段） */
const allActivitySummary = computed(() => store.activityStats?.all?.summary ?? null)

function rateText(rate: number | undefined | null): string {
  return rate != null ? `${Math.round(rate)}%` : '--'
}

/** 勾「全部活动·汇总」：清除其它码（兜底选项，取消时若将清空则忽略） */
async function toggleAllActivity() {
  if (isAllActivitySelected.value) return
  await store.selectActivities([ALL_ACTIVITY_CODE])
  activityDropdownOpen.value = true
}

/** 勾/取消单个活动；从「全部」切换到具体活动；结果为空则回落到全部活动（后端空参=全部） */
async function toggleActivityCode(code: string) {
  let next: string[]
  if (isAllActivitySelected.value) {
    next = [code]
  } else {
    next = store.selectedActivityCodes.includes(code)
      ? store.selectedActivityCodes.filter(c => c !== code)
      : [...store.selectedActivityCodes, code]
  }
  // 修复：取消最后一个勾选时不忽略——空数组走后端"全部活动"语义，
  // 避免残留旧勾选导致页面渲染两个活动（原来 if (!next.length) return 吞掉了取消）
  await store.selectActivities(next)
  activityDropdownOpen.value = true
}

/** 单活动漏斗图 option（多选并排用） */
function activityItemFunnelOpt(item: ActivityStatsItem) {
  return item.summary?.stages?.length
    ? buildActivityFunnelOption(
        item.summary.stages.map(s => ({ name: s.label, value: s.value, rate: s.rate })),
      )
    : getEmptyChartOption()
}

/** 漏斗说明文案：跟随活动实际阶段动态生成（不再写死四阶段），单选传 null 用当前选中活动 */
function funnelDescFor(item: ActivityStatsItem | null) {
  const stages = (item ? item.summary?.stages : store.activitySummary?.stages) ?? []
  if (!stages.length) return '参与各阶段转化率分析'
  const chain = stages.map(s => `${s.label}完成`).join(' → ')
  return `参与 → ${chain} 各阶段转化率`
}

/** 单活动转化率图 option（多选并列用） */
function activityItemConvOpt(item: ActivityStatsItem) {
  return item.conversion?.stages?.length
    ? buildActivityConvOption(item.conversion.stages)
    : getEmptyChartOption()
}

const handleResize = () => funnelChart?.resize()

onMounted(async () => {
  nextTick(initFunnel)
  window.addEventListener('resize', handleResize)
  await store.loadBusinessMetrics()
  if (store.dateRange === 'realtime') await store.startAutoRefresh()
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
const agentDistOpt = computed(() => {
  const agents = store.agentDistribution
    .filter(a => !a.name.toLowerCase().startsWith('test'))
    .slice(0, 15)
  return agents.length
    ? buildAgentDistributionOption(agents)
    : getEmptyChartOption()
})
const versionDistOpt = computed(() => {
  const versions = store.versionDistribution
    .filter(v => !String(v.version).toLowerCase().startsWith('test'))
    .slice(0, 20)
  return versions.length
    ? buildVersionDistributionOption(versions)
    : getEmptyChartOption()
})
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

// ==================== 沙箱观测（Issue #134） ====================

/** #113 空态适配：avgDurationSec / delta 为 null 时显示 -- */
const avgDurationText = computed(() =>
  store.sandboxSummary?.avgDurationSec != null
    ? store.sandboxSummary.avgDurationSec.toFixed(1)
    : '--'
)
const avgDurationTrend = computed(() => {
  const delta = store.sandboxSummary?.avgDurationDeltaSec
  if (store.sandboxSummary?.avgDurationSec == null) return '-- 较前日'
  const arrow = delta != null && delta >= 0 ? '↑' : '↓'
  return `${arrow} ${Math.abs(delta ?? 0).toFixed(1)}s 较前日`
})
const avgDurationTrendDir = computed(() => {
  const delta = store.sandboxSummary?.avgDurationDeltaSec
  if (delta == null || store.sandboxSummary?.avgDurationSec == null) return 'flat'
  return delta >= 0 ? 'up' : 'down'
})

// ==================== 服务健康（#120） ====================
const healthTrendOpt = computed(() =>
  store.healthTrend?.length
    ? buildHealthTrendOption(store.healthTrend)
    : getEmptyChartOption()
)
const healthErrorTopOpt = computed(() =>
  store.healthErrorTop?.length
    ? buildHealthErrorTopOption(store.healthErrorTop)
    : getEmptyChartOption()
)
const healthSlowTopOpt = computed(() =>
  store.healthSlowTop?.length
    ? buildHealthSlowTopOption(store.healthSlowTop)
    : getEmptyChartOption()
)

const sandboxRevisitOpt = computed(() =>
  store.sandboxRevisitInterval?.buckets?.length
    ? buildSandboxRevisitIntervalOption(
        store.sandboxRevisitInterval.buckets,
        store.sandboxRevisitInterval.p50Seconds,
        store.sandboxRevisitInterval.p90Seconds,
      )
    : getEmptyChartOption()
)

const sandboxIdleOpt = computed(() =>
  store.sandboxIdle?.buckets?.length
    ? buildSandboxIdleOption(store.sandboxIdle.buckets)
    : getEmptyChartOption()
)

const failRateText = computed(() =>
  store.sandboxErrorStats?.totalEvents
    ? `${(store.sandboxErrorStats.failRate ?? 0).toFixed(1)}%`
    : '--'
)

const sandboxErrorTrendOpt = computed(() =>
  store.sandboxErrorStats?.dailyTrend?.length
    ? buildSandboxErrorTrendOption(store.sandboxErrorStats.dailyTrend)
    : getEmptyChartOption()
)

const sandboxErrorCodeOpt = computed(() =>
  store.sandboxErrorStats?.topErrorCodes?.length
    ? buildSandboxErrorCodeOption(store.sandboxErrorStats.topErrorCodes)
    : getEmptyChartOption()
)

const sandboxCostOpt = computed(() =>
  store.sandboxCostBreakdown?.items?.length
    ? buildSandboxCostOption(store.sandboxCostBreakdown.items)
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

const activityTrendOpt = computed(() => {
  if (store.isActivityMulti) {
    const items = store.selectedActivityItems
      .filter(i => i.trend?.stages?.length)
    return items.length
      ? buildActivityTrendMultiOption(items.map(i => ({
          name: i.name,
          stages: i.trend!.stages,
          submittedStages: i.trend!.submittedStages ?? [],
        })))
      : getEmptyChartOption()
  }
  return store.activityTrend?.stages?.length
    ? buildActivityTrendOption(store.activityTrend.stages, store.activityTrend.submittedStages)
    : getEmptyChartOption()
})
const activityConvOpt = computed(() =>
  store.activityConversion?.stages?.length
    ? buildActivityConvOption(store.activityConversion.stages)
    : getEmptyChartOption()
)

/** 活动阶段 KPI 样式：按阶段序号循环配色与图标 */
const ACTIVITY_STAGE_ACCENTS = ['green', 'orange', 'purple', 'cyan', 'red', 'blue'] as const
const ACTIVITY_STAGE_ICONS = ['📖', '📚', '🏆', '🚀', '⭐', '🎖'] as const
function activityStageStyle(i: number) {
  return {
    accent: ACTIVITY_STAGE_ACCENTS[i % ACTIVITY_STAGE_ACCENTS.length],
    icon: ACTIVITY_STAGE_ICONS[i % ACTIVITY_STAGE_ICONS.length],
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
}
// ==================== Section 6: 活动多选与汇总（Issue #119） ====================
.activity-toolbar {
  position: relative;
  margin-bottom: 16px;
}

.activity-select {
  display: inline-block;
}

.activity-select-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #1f2937;

  &:hover { border-color: #5b8def; }
}

.activity-select-label {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-select-arrow { color: #6b7280; font-size: 11px; }

.activity-select-backdrop {
  position: fixed;
  inset: 0;
  z-index: 98;
}

.activity-select-panel {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  min-width: 340px;
  max-height: 320px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 99;
  padding: 6px;
}

.activity-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;

  &:hover { background: #f5f7fa; }
  &.checked { background: rgba(91, 141, 239, 0.08); color: #1f2937; font-weight: 500; }

  input { accent-color: #5b8def; cursor: pointer; }
}

.activity-option-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-option-date {
  font-size: 11px;
  color: #9ca3af;
}

.activity-option-empty {
  padding: 16px 10px;
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
}

.all-summary-row {
  background: linear-gradient(90deg, rgba(91, 141, 239, 0.08), rgba(114, 46, 209, 0.05));
  border: 1px solid rgba(91, 141, 239, 0.25);
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 24px;
}

.all-summary-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.all-summary-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 13px;
  color: #4b5563;

  b { color: #1f2937; font-size: 15px; }
}

.all-summary-note {
  margin-top: 8px;
  font-size: 11px;
  color: #92400e;
}

.activity-kpi-group {
  margin-bottom: 8px;

  .sub-section-title { margin-bottom: 12px; }
  .kpi-grid { margin-bottom: 16px; }
}

// KPI badge (inside KpiCard slot)
.release-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 4px 8px;
}

.release-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 4px;
  border-bottom: 1px solid #F3F4F6;
  font-size: 12px;
}

.release-item:last-child { border-bottom: none; }

.release-tag {
  font-weight: 600;
  color: #1F2937;
  min-width: 90px;
}

.release-name {
  flex: 1;
  color: #6B7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.release-date { color: #9CA3AF; }

.release-dl { color: #5B8DEF; font-weight: 500; }

.release-empty {
  text-align: center;
  color: #9CA3AF;
  padding: 24px 0;
  font-size: 12px;
}
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

  .range-switch {
    display: inline-flex;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;

    button {
      border: none;
      background: #fff;
      color: #6b7280;
      font-size: 12px;
      padding: 6px 14px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) { color: #1f2937; background: #f9fafb; }
      &.active { background: #5b8def; color: #fff; font-weight: 600; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
  }

  .realtime-error {
    font-size: 12px;
    color: #d97706;
    background: #fffbeb;
    border: 1px solid #fde68a;
    padding: 6px 12px;
    border-radius: 6px;
  }

  .date-range {
    font-size: 12px;
    color: #6b7280;
    background: #f0f2f5;
    padding: 6px 14px;
    border-radius: 6px;
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
