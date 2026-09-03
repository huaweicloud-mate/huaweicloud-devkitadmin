<template>
  <div class="kpi-card" :class="'accent-' + accent">
    <div class="kpi-main">
      <div class="label">{{ label }}</div>
      <div class="value">{{ value }}<span v-if="unit" class="unit">{{ unit }}</span></div>
      <div v-if="trend" class="trend" :class="trendDir">
        <span>{{ trendIcon }}</span> {{ trend }}
      </div>
    </div>
    <slot name="badge" />
    <div class="icon-bg">{{ icon }}</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  label: string
  value: string | number
  unit?: string
  trend?: string
  trendDir?: 'up' | 'down' | 'flat'
  accent?: 'blue' | 'green' | 'orange' | 'red' | 'cyan' | 'purple'
  icon?: string
}>(), {
  unit: '',
  trend: '',
  trendDir: 'flat',
  accent: 'blue',
  icon: '',
})
const trendIcon = computed(() => {
  if (props.trendDir === 'up') return '↑'
  if (props.trendDir === 'down') return '↓'
  return '→'
})
</script>
<style scoped lang="scss">
.kpi-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  &.accent-blue { border-top: 3px solid #5b8def; }
  &.accent-green { border-top: 3px solid #52c41a; }
  &.accent-orange { border-top: 3px solid #faad14; }
  &.accent-red { border-top: 3px solid #ff4d4f; }
  &.accent-cyan { border-top: 3px solid #13c2c2; }
  &.accent-purple { border-top: 3px solid #722ed1; }
  .kpi-main {
    flex: 1;
    position: relative;
    z-index: 1;
  }
  .label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  .value {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.2;
    .unit {
      font-size: 13px;
      color: #9ca3af;
      font-weight: 400;
      margin-left: 3px;
    }
  }
  .trend {
    font-size: 12px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
    &.up { color: #52c41a; }
    &.down { color: #ff4d4f; }
    &.flat { color: #9ca3af; }
  }
  .icon-bg {
    position: absolute;
    right: -10px;
    bottom: -10px;
    font-size: 64px;
    opacity: 0.06;
    line-height: 1;
    pointer-events: none;
  }
}
</style>
