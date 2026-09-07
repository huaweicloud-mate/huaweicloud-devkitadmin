<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-dialog">
        <div class="modal-header">
          <span class="modal-title">用户详情</span>
          <button class="modal-close" @click="$emit('close')">×</button>
        </div>
        <div v-if="user" class="modal-body">
          <div class="profile-row">
            <div class="avatar">{{ user.name.charAt(0) }}</div>
            <div>
              <div class="profile-name">{{ user.name }}</div>
              <div class="profile-id">{{ user.id }}</div>
            </div>
            <div class="profile-status" :class="'status-' + user.status">
              {{ statusLabel[user.status] }}
            </div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">邮箱</div>
              <div class="info-value">{{ user.email }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">电话</div>
              <div class="info-value">{{ user.phone }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">公司</div>
              <div class="info-value">{{ user.company }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">注册日期</div>
              <div class="info-value">{{ user.regDate }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">最后活跃</div>
              <div class="info-value">{{ user.lastActive }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">活跃天数</div>
              <div class="info-value">{{ user.totalDays }} 天</div>
            </div>
            <div class="info-item">
              <div class="info-label">连续活跃</div>
              <div class="info-value">{{ user.continuousDays }} 天</div>
            </div>
            <div class="info-item">
              <div class="info-label">部署次数</div>
              <div class="info-value">{{ user.deployCount }}</div>
            </div>
          </div>

          <div class="section-title">Agent 接入（{{ user.agentCount }}）</div>
          <div class="tag-list">
            <span v-for="agent in user.agents" :key="agent" class="agent-tag">{{ agent }}</span>
            <span v-if="user.agents.length === 0" class="no-data">暂无</span>
          </div>

          <div class="section-title">调用统计</div>
          <div class="stat-row">
            <div class="stat-item">
              <div class="stat-value">{{ user.totalAgentCalls }}</div>
              <div class="stat-label">总调用</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ user.skillCalls }}</div>
              <div class="stat-label">Skill 调用</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ user.mcpCalls }}</div>
              <div class="stat-label">MCP 调用</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ user.openCalls }}</div>
              <div class="stat-label">开放能力调用</div>
            </div>
          </div>

          <div class="section-title">代金券</div>
          <div class="stat-row">
            <div class="stat-item">
              <div class="stat-value">¥{{ user.voucherAmount }}</div>
              <div class="stat-label">领取金额</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ user.voucherCount }}</div>
              <div class="stat-label">领取次数</div>
            </div>
          </div>
        </div>

        <div v-else class="modal-empty">未找到用户信息</div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { users } from '../data/charts'
import type { UserRecord } from '../data/charts'

const props = defineProps<{
  visible: boolean
  userId: string | null
}>()

defineEmits<{
  close: []
}>()

const statusLabel: Record<string, string> = {
  active: '活跃',
  low: '低活跃',
  churned: '流失',
}

const user = computed<UserRecord | undefined>(() =>
  props.userId ? users.find(u => u.id === props.userId) : undefined,
)
</script>
<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-dialog {
  background: #fff;
  border-radius: 12px;
  width: 560px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 22px;
    color: #9ca3af;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
    &:hover {
      color: #4b5563;
    }
  }
}
.modal-body {
  padding: 24px;
}
.profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #5b8def;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .profile-name {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }
  .profile-id {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 2px;
  }
  .profile-status {
    margin-left: auto;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    &.status-active {
      background: #f6ffed;
      color: #52c41a;
      border: 1px solid #b7eb8f;
    }
    &.status-low {
      background: #fffbe6;
      color: #faad14;
      border: 1px solid #ffe58f;
    }
    &.status-churned {
      background: #fff1f0;
      color: #ff4d4f;
      border: 1px solid #ffa39e;
    }
  }
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  margin-bottom: 24px;
}
.info-item {
  .info-label {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 4px;
  }
  .info-value {
    font-size: 14px;
    color: #1f2937;
    font-weight: 500;
  }
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
  margin-top: 20px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f5f5f5;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.agent-tag {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  background: #f0f5ff;
  color: #5b8def;
  border: 1px solid #adc6ff;
}
.no-data {
  font-size: 13px;
  color: #d1d5db;
}
.stat-row {
  display: flex;
  gap: 24px;
  margin-bottom: 8px;
}
.stat-item {
  text-align: center;
  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #1f2937;
  }
  .stat-label {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
  }
}
.modal-empty {
  padding: 48px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}
</style>
