<template>
  <div class="chart-card">
    <div class="chart-title">{{ title }}</div>
    <div v-if="desc" class="chart-desc">{{ desc }}</div>
    <div ref="chartRef" :style="{ height: height + 'px' }"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  title: string
  desc?: string
  option: EChartsOption
  height?: number
}>(), {
  desc: '',
  height: 240,
})

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  if (chart) chart.dispose()
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
}

const handleResize = () => chart?.resize()

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(() => props.option, (newOpt) => {
  if (chart) {
    chart.setOption(newOpt)
  }
}, { deep: true })
</script>
<style scoped lang="scss">
.chart-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  .chart-title {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
  }
  .chart-desc {
    font-size: 11px;
    color: #9ca3af;
    margin-bottom: 12px;
    margin-top: 2px;
  }
}
</style>
