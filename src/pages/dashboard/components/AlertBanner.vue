<template>
  <div class="alert-banner">
    <div class="alert-icon">{{ icon }}</div>
    <div class="alert-content">
      <div v-if="title" class="alert-title">{{ title }}</div>
      <div class="alert-text">{{ text }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  text: string
  icon?: string
}>(), {
  title: '',
  icon: '💡',
})
</script>
<style scoped lang="scss">
.alert-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f0f5ff;
  border: 1px solid #adc6ff;
  border-radius: 8px;
  padding: 12px 16px;
  .alert-icon {
    font-size: 18px;
    line-height: 1.4;
    flex-shrink: 0;
  }
  .alert-content {
    flex: 1;
  }
  .alert-title {
    font-size: 13px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }
  .alert-text {
    font-size: 13px;
    color: #4b5563;
    line-height: 1.6;
  }
}
</style>
