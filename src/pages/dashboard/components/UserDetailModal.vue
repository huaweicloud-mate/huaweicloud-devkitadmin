<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay show" @click.self="close">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ user.name }} 的用户详情</h3>
          <button class="modal-close" @click="close">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-section">
            <div class="modal-section-title">📋 基本信息</div>
            <div class="modal-info-grid">
              <div class="modal-info-item"><div class="mi-label">domainId</div><div class="mi-value">{{ user.id }}</div></div>
              <div class="modal-info-item"><div class="mi-label">最后活跃</div><div class="mi-value" style="font-size:13px">{{ user.lastActive }}</div></div>
              <div class="modal-info-item"><div class="mi-label">用户状态</div><div class="mi-value"><span class="tag" :class="statusClass">{{ statusLabel }}</span></div></div>
            </div>
          </div>
          <div class="modal-section">
            <div class="modal-section-title">📊 活跃与使用概览</div>
            <div class="modal-kpi-row">
              <div class="modal-kpi"><div class="mk-value">{{ user.totalDays }}</div><div class="mk-label">累计活跃天数</div></div>
              <div class="modal-kpi"><div class="mk-value">{{ user.continuousDays }}</div><div class="mk-label">连续活跃天数</div></div>
              <div class="modal-kpi"><div class="mk-value">{{ user.deployCount }}</div><div class="mk-label">累计部署次数</div></div>
              <div class="modal-kpi"><div class="mk-value">{{ user.totalAgentCalls }}</div><div class="mk-label">Agent调用总次数</div></div>
              <div class="modal-kpi"><div class="mk-value">{{ user.agentCount }}</div><div class="mk-label">接入Agent数</div></div>
            </div>
          </div>
          <div class="modal-section">
            <div class="modal-section-title">🔗 能力调用分布</div>
            <div class="modal-kpi-row">
              <div class="modal-kpi"><div class="mk-value" style="color:#5B8DEF;">{{ user.skillCalls }}</div><div class="mk-label">Skill 调用</div></div>
              <div class="modal-kpi"><div class="mk-value" style="color:#52C41A;">{{ user.mcpCalls }}</div><div class="mk-label">MCP 调用</div></div>
              <div class="modal-kpi"><div class="mk-value" style="color:#FAAD14;">{{ user.openCalls }}</div><div class="mk-label">开放能力调用</div></div>
            </div>
            <div class="modal-chart" ref="pieChartRef" style="margin-top:12px;"></div>
          </div>
          <div class="modal-section">
            <div class="modal-section-title">🤖 已接入 Agent（{{ agents.length }}）</div>
            <div class="modal-tag-row">
              <span v-if="agents.length" v-for="a in agents" :key="a" class="modal-agent-tag">
                <span class="dot"></span>{{ a }}
              </span>
              <span v-else style="color:#9ca3af;font-size:12px;">暂未接入任何 Agent</span>
            </div>
          </div>
          <div class="modal-section">
            <div class="modal-section-title">📝 部署历史</div>
            <div class="table-wrap">
              <table class="data-table modal-table">
                <thead><tr><th>版本</th><th>Agent</th><th>部署时间</th><th>状态</th><th>沙箱耗时</th></tr></thead>
                <tbody>
                  <tr v-if="deployRows.length === 0"><td colspan="5" style="text-align:center;color:#9ca3af;padding:20px;">暂无部署记录</td></tr>
                  <tr v-else v-for="d in deployRows" :key="d.time">
                    <td>{{ d.ver }}</td><td>{{ d.agent }}</td><td>{{ d.time }}</td>
                    <td><span class="tag tag-green">{{ d.status }}</span></td><td>{{ d.sandbox }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-section">
            <div class="modal-section-title">🎫 代金券领取记录</div>
            <div class="table-wrap">
              <table class="data-table modal-table">
                <thead><tr><th>记录ID</th><th>面额</th><th>领取时间</th><th>来源</th></tr></thead>
                <tbody>
                  <tr v-if="voucherRows.length === 0"><td colspan="4" style="text-align:center;color:#9ca3af;padding:20px;">暂无代金券领取记录</td></tr>
                  <tr v-else v-for="v in voucherRows" :key="v.id">
                    <td>{{ v.id }}</td><td>{{ v.amount }}</td><td>{{ v.date }}</td><td>{{ v.source }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { users } from '../data/charts'

const props = defineProps<{
  visible: boolean
  userId: string | null
}>()

const emit = defineEmits<{ close: [] }>()

const pieChartRef = ref<HTMLDivElement>()
let pieChart: echarts.ECharts | null = null

const user = computed(() => users.find(u => u.id === props.userId) || users[0])

const statusMap: Record<string, { label: string; cls: string }> = {
  active: { label: '活跃', cls: 'tag-green' },
  low: { label: '低活跃', cls: 'tag-orange' },
  churned: { label: '已流失', cls: 'tag-gray' },
}

const statusLabel = computed(() => statusMap[user.value.status]?.label || '')
const statusClass = computed(() => statusMap[user.value.status]?.cls || '')

const agentNameMap: Record<string, string> = {
  'opencode linux': 'opencode', 'opencode windows': 'opencode',
  'codex windows': 'codex', 'workbuddy windows': 'workbuddy',
  '码道 IDE windows': '码道', '码道 CLI': '码道', '码道 work windows': '码道',
  'officeace windows': 'officeace',
}

const agents = computed(() => [...new Set(user.value.agents.map(a => agentNameMap[a] || a))])

const voucherRows = computed(() => {
  const u = user.value
  if (u.voucherCount === 0) return []
  const rows = [{ id: 'V-' + u.id + '-001', amount: u.voucherAmount >= 500 ? '¥500' : '¥' + u.voucherAmount, date: '2026-08-28', source: '新手活动' }]
  if (u.voucherCount > 1) rows.push({ id: 'V-' + u.id + '-002', amount: '¥' + (u.voucherAmount - 500 > 0 ? u.voucherAmount - 500 : u.voucherAmount), date: '2026-08-15', source: '活动奖励' })
  if (u.voucherCount > 2) rows.push({ id: 'V-' + u.id + '-003', amount: '¥200', date: '2026-08-05', source: '签到奖励' })
  return rows
})

const deployRows = computed(() => {
  const u = user.value
  if (u.deployCount === 0) return []
  const rows = [
    { ver: 'v2.4.1', agent: agentNameMap[u.agents[0]] || '-', time: '2026-09-01 07:45', status: '成功', sandbox: '8.2s' },
    { ver: 'v2.4.0', agent: agentNameMap[u.agents[0]] || '-', time: '2026-08-28 14:20', status: '成功', sandbox: '7.5s' },
  ]
  if (u.deployCount > 2) rows.push({ ver: 'v2.3.2', agent: agentNameMap[u.agents[1] || u.agents[0]] || '-', time: '2026-08-20 09:15', status: '成功', sandbox: '9.1s' })
  if (u.deployCount > 5) rows.push({ ver: 'v2.3.1', agent: agentNameMap[u.agents[0]] || '-', time: '2026-08-10 16:30', status: '成功', sandbox: '10.3s' })
  if (u.deployCount > 10) rows.push({ ver: 'v2.3.0', agent: agentNameMap[u.agents[1] || u.agents[0]] || '-', time: '2026-07-25 11:00', status: '成功', sandbox: '8.8s' })
  if (u.deployCount > 20) rows.push({ ver: 'v2.2.0', agent: agentNameMap[u.agents[0]] || '-', time: '2026-07-10 13:45', status: '成功', sandbox: '12.1s' })
  return rows
})

function close() {
  emit('close')
}

function initPieChart() {
  if (!pieChartRef.value) return
  if (pieChart) { pieChart.dispose(); pieChart = null }
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['35%', '60%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11, formatter: '{b}\n{c}次' },
      data: [
        { value: user.value.skillCalls, name: 'Skill调用', itemStyle: { color: '#5B8DEF' } },
        { value: user.value.mcpCalls, name: 'MCP调用', itemStyle: { color: '#52C41A' } },
        { value: user.value.openCalls, name: '开放能力调用', itemStyle: { color: '#FAAD14' } },
      ],
    }],
  })
}

watch(() => props.visible, (v) => {
  if (v) {
    document.body.style.overflow = 'hidden'
    nextTick(initPieChart)
  } else {
    document.body.style.overflow = ''
    if (pieChart) { pieChart.dispose(); pieChart = null }
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) close()
}

if (typeof window !== 'undefined') {
  document.addEventListener('keydown', onKeydown)
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', onKeydown)
  }
  if (pieChart) pieChart.dispose()
})
</script>

<style scoped lang="scss">
.modal-overlay {
  display: none;
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.45); z-index: 9999;
  justify-content: center; align-items: flex-start;
  padding: 40px 20px; overflow-y: auto;

  &.show { display: flex; }
}

.modal-box {
  background: #fff; border-radius: 12px; width: 100%; max-width: 880px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: modalIn 0.25s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; border-bottom: 1px solid #e5e7eb;

  h3 { font-size: 17px; font-weight: 700; }
  .modal-close {
    width: 32px; height: 32px; border-radius: 50%; border: none;
    background: #f3f4f6; cursor: pointer; font-size: 16px; color: #6b7280;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;

    &:hover { background: #e5e7eb; }
  }
}

.modal-body {
  padding: 24px; max-height: calc(100vh - 200px); overflow-y: auto;
}

.modal-section { margin-bottom: 24px; }
.modal-section:last-child { margin-bottom: 0; }

.modal-section-title {
  font-size: 13px; font-weight: 600; color: #1f2937;
  margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #5b8def;
  display: flex; align-items: center; gap: 6px;
}

.modal-info-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}

.modal-info-item {
  background: #f8fafc; border-radius: 8px; padding: 12px 14px;

  .mi-label { font-size: 11px; color: #9ca3af; margin-bottom: 4px; }
  .mi-value { font-size: 15px; font-weight: 600; color: #1f2937; }
  .mi-sub { font-size: 11px; color: #6b7280; margin-top: 2px; }
}

.modal-kpi-row { display: flex; gap: 12px; flex-wrap: wrap; }

.modal-kpi {
  flex: 1; min-width: 120px; background: #f8fafc; border-radius: 8px;
  padding: 14px; text-align: center;

  .mk-value { font-size: 22px; font-weight: 700; color: #5b8def; }
  .mk-label { font-size: 11px; color: #6b7280; margin-top: 4px; }
}

.modal-chart { width: 100%; height: 200px; }

.modal-tag-row { display: flex; flex-wrap: wrap; gap: 6px; }

.modal-agent-tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 6px; font-size: 12px;
  background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;

  .dot { width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; }
}

.table-wrap { overflow-x: auto; border-radius: 8px; }

.data-table {
  width: 100%; border-collapse: collapse; font-size: 12px;

  th {
    background: #f8fafc; padding: 10px 14px; text-align: left;
    font-weight: 600; color: #6b7280; border-bottom: 2px solid #e5e7eb;
    white-space: nowrap;
  }

  td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #1f2937; }
  tr:hover td { background: #f8fafc; }
}

.tag {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-size: 11px; font-weight: 500;

  &.tag-green { background: #d1fae5; color: #065f46; }
  &.tag-orange { background: #fef3c7; color: #92400e; }
  &.tag-gray { background: #f3f4f6; color: #4b5563; }
}
</style>