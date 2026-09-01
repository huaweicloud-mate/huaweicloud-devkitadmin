<template>
  <div class="chart-card">
    <div class="chart-title">
      <span>{{ title }}</span>
      <div v-if="tabs.length" class="chart-tabs">
        <span
          v-for="tab in tabs"
          :key="tab"
          class="chart-tab"
          :class="{ active: activeTab === tab }"
          @click="$emit('tabChange', tab)"
        >{{ tab }}</span>
      </div>
    </div>
    <div v-if="desc" class="chart-desc">{{ desc }}</div>
    <div class="chart-body" ref="chartRef" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = withDefaults(defineProps<{
  title: string
  desc?: string
  height?: number
  option: echarts.EChartsOption
  tabs?: string[]
  activeTab?: string
}>(), {
  desc: '',
  height: 300,
  tabs: () => [],
  activeTab: '',
})

defineEmits<{ tabChange: [tab: string] }>()

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
  setTimeout(() => chart?.resize(), 0)
}

function handleResize() {
  chart?.resize()
}

onMounted(() => {
  nextTick(initChart)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  chart = null
})

watch(() => props.option, (newOpt) => {
  chart?.setOption(newOpt, true)
}, { deep: true })
</script>

<style scoped lang="scss">
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

  .chart-body {
    width: 100%;
  }

  .chart-tabs {
    display: flex;
    gap: 4px;

    .chart-tab {
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 4px;
      cursor: pointer;
      color: #6b7280;
      background: #f0f2f5;
      transition: all 0.2s;

      &.active {
        background: #5b8def;
        color: #fff;
      }
    }
  }
}
</style>