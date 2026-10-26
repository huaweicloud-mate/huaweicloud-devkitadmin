<template>
  <section class="section">
    <div class="activity-toolbar">
      <span class="activity-toolbar-label">活动</span>
      <select
        class="activity-select"
        :value="store.activityCode"
        :disabled="store.loading"
        @change="onActivityCodeChange"
      >
        <option v-for="opt in store.activityCodeOptions" :key="opt.code" :value="opt.code">
          {{ opt.code }} · {{ opt.name }}
        </option>
      </select>
      <span class="activity-toolbar-hint">{{ activityStages.length }} 个阶段</span>
    </div>

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
        v-for="(stage, i) in activityStages"
        :key="stage.key"
        :label="`${stage.label}完成人数`"
        :value="fmt(stage.value)"
        :trend="`完成率 ${Math.round(stage.rate)}%`"
        trend-dir="flat"
        :accent="stageAccent(i)"
        :icon="stageIcon(i)"
      />
    </div>

    <div class="chart-row one">
      <ChartCard title="活动转化漏斗" :desc="funnelDesc" :option="activityFunnelOpt" :height="380" />
    </div>
    <AlertBanner style="margin-top:12px" title="转化分析" :text="funnelAlertText" />

    <div class="chart-row two">
      <ChartCard title="各阶段每日完成人数趋势" desc="近14天各阶段每日完成人数趋势" :option="activityTrendOpt" />
      <ChartCard title="各阶段转化率对比" desc="阶段间转化率与整体转化率分析" :option="activityConvOpt" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KpiCard from './KpiCard.vue'
import ChartCard from './ChartCard.vue'
import AlertBanner from './AlertBanner.vue'
import { useDashboardStore } from '@/store/dashboard'
import {
  getEmptyChartOption,
  buildActivityFunnelOption, buildActivityTrendOption, buildActivityConvOption,
} from '../data/charts'

const store = useDashboardStore()

function fmt(val: number | undefined | null): string {
  return val == null ? '--' : val.toLocaleString()
}

type KpiAccent = 'blue' | 'green' | 'orange' | 'red' | 'cyan' | 'purple'

/** 阶段卡配色（按序号，不依赖阶段名） */
function stageAccent(i: number): KpiAccent {
  return (['green', 'orange', 'purple', 'cyan'] as KpiAccent[])[i % 4]
}

/** 阶段卡图标（按序号） */
function stageIcon(i: number): string {
  return ['📖', '📚', '🏆', '🎯'][i % 4]
}

/** 活动阶段（后端返回，数量/名称随活动而变） */
const activityStages = computed(() => store.activitySummary?.stages ?? [])

/** 漏斗数据：参与 + 各阶段（后端已移除 funnel 字段，前端自建） */
const activityFunnel = computed(() => {
  const s = store.activitySummary
  if (!s) return [] as Array<{ name: string; value: number; rate: number }>
  const head = { name: '参与', value: s.totalParticipants, rate: 100 }
  const stages = s.stages.map(st => ({ name: st.label, value: st.value, rate: st.rate }))
  return [head, ...stages]
})

const activityFunnelOpt = computed(() =>
  activityFunnel.value.length
    ? buildActivityFunnelOption(activityFunnel.value)
    : getEmptyChartOption()
)

/** 漏斗描述：按实际阶段名拼接 */
const funnelDesc = computed(() => {
  const names = (store.activitySummary?.stages ?? []).map(st => st.label)
  return names.length ? `参与 → ${names.join(' → ')} 各阶段转化率分析` : '各阶段转化率分析'
})

const funnelAlertText = computed(() => {
  const s = store.activitySummary
  const funnel = activityFunnel.value
  if (!s || s.totalParticipants === 0 || funnel.length < 2) return '暂无活动数据'
  const drops = funnel
    .slice(1)
    .map((stage, i) => {
      const prev = funnel[i].value
      const rate = prev > 0 ? Math.round(100 - (stage.value / prev * 100)) : null
      return { stage: `${funnel[i].name}→${stage.name}`, rate }
    })
    .filter(d => d.rate != null) as Array<{ stage: string; rate: number }>
  if (!drops.length) return `活动共 ${funnel.length - 1} 个阶段，数据积累中。`
  const maxDrop = drops.reduce((a, b) => (b.rate > a.rate ? b : a))
  const last = funnel[funnel.length - 1]
  return `${maxDrop.stage}流失率最高（${maxDrop.rate}%），建议优化该环节任务难度或增加引导。${last.name}完成率${Math.round(last.rate)}%仍有提升空间。`
})

/** 活动各阶段完成趋势（名称/数据均来自后端 stages） */
const activityTrendOpt = computed(() => {
  const series = (store.activityTrend?.stages ?? []).map(st => ({ name: st.label, points: st.points }))
  return series.length ? buildActivityTrendOption(series) : getEmptyChartOption()
})

const activityConvOpt = computed(() =>
  store.activityConversion?.stages?.length
    ? buildActivityConvOption(store.activityConversion.stages)
    : getEmptyChartOption()
)

/** 切换活动：仅重查活动统计 3 个接口 */
function onActivityCodeChange(e: Event) {
  store.setActivityCode((e.target as HTMLSelectElement).value)
}
</script>

<style scoped lang="scss">
.activity-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;

  .activity-toolbar-label {
    font-size: 12px;
    color: #6b7280;
  }
  .activity-select {
    font-size: 13px;
    color: #1f2937;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 6px 10px;
    min-width: 240px;
    outline: none;
    cursor: pointer;
    &:focus { border-color: #5b8def; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .activity-toolbar-hint {
    font-size: 12px;
    color: #9ca3af;
  }
}
</style>