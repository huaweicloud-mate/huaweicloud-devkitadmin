<template>
  <div class="alert-banner" :class="type">
    <div class="alert-icon">{{ type === 'warning' ? '💡' : '⚠️' }}</div>
    <div class="alert-content">
      <div class="alert-title">{{ title }}</div>
      <div class="alert-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  text: string
  type?: 'warning' | 'danger'
}>(), {
  type: 'warning',
})
</script>

<style scoped lang="scss">
.alert-banner {
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &.warning {
    background: #fef3c7;
    border: 1px solid #fcd34d;

    .alert-title { color: #92400e; }
    .alert-text { color: #b45309; }
  }

  &.danger {
    background: #fee2e2;
    border-color: #fca5a5;

    .alert-title { color: #991b1b; }
    .alert-text { color: #b91c1c; }
  }

  .alert-icon { font-size: 18px; flex-shrink: 0; }
  .alert-content { flex: 1; }
  .alert-title { font-size: 13px; font-weight: 600; }
  .alert-text { font-size: 12px; margin-top: 2px; }
}
</style>