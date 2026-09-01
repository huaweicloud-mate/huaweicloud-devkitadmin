import type { EChartsOption } from 'echarts'

const colorPalette = ['#5B8DEF', '#52C41A', '#FAAD14', '#FF4D4F', '#13C2C2', '#722ED1']

const axisStyle = {
  axisLine: { lineStyle: { color: '#E5E7EB' } },
  axisLabel: { color: '#9CA3AF', fontSize: 11 },
  splitLine: { lineStyle: { color: '#F3F4F6' } },
}

export function genDates(days: number): string[] {
  const dates: string[] = []
  const today = new Date('2026-09-01')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.getMonth() + 1 + '/' + d.getDate())
  }
  return dates
}

export function genData(days: number, base: number, variance: number): number[] {
  return Array.from({ length: days }, (_, i) =>
    Math.round(base + Math.sin(i * 0.3) * variance + Math.random() * variance * 0.6),
  )
}

// ======================== Section 1: 业务核心指标 ========================

export function getDauMauOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['DAU', 'MAU'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 40, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: genDates(30), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 4 } },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      {
        name: 'DAU', type: 'line', smooth: true, data: genData(30, 3500, 400),
        itemStyle: { color: '#5B8DEF' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(91,141,239,0.25)' }, { offset: 1, color: 'rgba(91,141,239,0)' }],
          },
        },
      },
      { name: 'MAU', type: 'line', smooth: true, data: genData(30, 8800, 300), itemStyle: { color: '#722ED1' } },
    ],
  }
}

export function getNewUserOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增用户', '环比增长%', '同比增长%'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 45, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: ['3月', '4月', '5月', '6月', '7月', '8月'], ...axisStyle },
    yAxis: [
      { type: 'value', name: '人数', ...axisStyle },
      { type: 'value', name: '增长率%', ...axisStyle, axisLabel: { ...axisStyle.axisLabel, formatter: '{value}%' } },
    ],
    series: [
      { name: '新增用户', type: 'bar', data: [580, 720, 810, 890, 956, 1120], itemStyle: { color: '#5B8DEF', borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '环比增长%', type: 'line', yAxisIndex: 1, data: [null, 24.1, 12.5, 9.9, 7.4, 17.2], itemStyle: { color: '#52C41A' } },
      { name: '同比增长%', type: 'line', yAxisIndex: 1, data: [null, null, null, 32.5, 38.7, 45.2], itemStyle: { color: '#FAAD14' } },
    ],
  }
}

export function getAgentTypeOption(): EChartsOption {
  const agents = ['AtomCode', 'hermes', 'openclaw', 'DSH', 'officeace windows',
    '码道 work windows', '码道 CLI', '码道 IDE windows',
    'workbuddy windows', 'codex windows', 'opencode windows', 'opencode linux'].reverse()
  const data = [156, 203, 287, 312, 389, 445, 502, 567, 634, 712, 890, 1245].reverse()
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 130, right: 30, top: 10, bottom: 25 },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: { type: 'category', data: agents, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, fontSize: 11 } },
    series: [{
      type: 'bar', data, itemStyle: { borderRadius: [0, 4, 4, 0] },
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

export function getDownloadTrendOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['GitHub', 'npm', '市场'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: genDates(30), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 4 } },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      { name: 'GitHub', type: 'line', smooth: true, data: genData(30, 1050, 180), itemStyle: { color: '#5B8DEF' } },
      { name: 'npm', type: 'line', smooth: true, data: genData(30, 1400, 220), itemStyle: { color: '#52C41A' } },
      { name: '市场', type: 'line', smooth: true, data: genData(30, 450, 80), itemStyle: { color: '#FAAD14' } },
    ],
  }
}

export function getGhNpmDailyOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['GitHub日下载', 'npm日下载'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: genDates(14), ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      { name: 'GitHub日下载', type: 'bar', data: genData(14, 1050, 150), itemStyle: { color: '#5B8DEF', borderRadius: [3, 3, 0, 0] }, barWidth: '30%' },
      { name: 'npm日下载', type: 'bar', data: genData(14, 1400, 180), itemStyle: { color: '#52C41A', borderRadius: [3, 3, 0, 0] }, barWidth: '30%' },
    ],
  }
}

export function getDownloadPieOption(): EChartsOption {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '52%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11, formatter: '{b}\n{d}%' },
      data: [
        { value: 32104, name: 'GitHub', itemStyle: { color: '#5B8DEF' } },
        { value: 41890, name: 'npm', itemStyle: { color: '#52C41A' } },
        { value: 13568, name: '市场', itemStyle: { color: '#FAAD14' } },
      ],
    }],
  }
}

// ======================== Section 2: 开放能力 ========================

export function getCapabilityTrendOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Skill调用', 'MCP调用', '开放能力调用'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: genDates(14), ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      { name: 'Skill调用', type: 'line', smooth: true, data: genData(14, 11000, 1800), itemStyle: { color: '#5B8DEF' } },
      { name: 'MCP调用', type: 'line', smooth: true, data: genData(14, 6400, 1000), itemStyle: { color: '#52C41A' } },
      { name: '开放能力调用', type: 'line', smooth: true, data: genData(14, 9500, 1400), itemStyle: { color: '#FAAD14' } },
    ],
  }
}

export function getCapabilityPieOption(): EChartsOption {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11 },
      data: [
        { value: 156832, name: 'Skill', itemStyle: { color: '#5B8DEF' } },
        { value: 89241, name: 'MCP', itemStyle: { color: '#52C41A' } },
        { value: 43567, name: 'CLI', itemStyle: { color: '#FAAD14' } },
        { value: 0, name: 'API (暂无)', itemStyle: { color: '#FF4D4F' } },
        { value: 0, name: 'SDK (暂无)', itemStyle: { color: '#E5E7EB' } },
        { value: 0, name: 'TF (暂无)', itemStyle: { color: '#D1D5DB' } },
      ],
    }],
  }
}

export function getSkillRankOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 120, right: 30, top: 10, bottom: 25 },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: { type: 'category', data: ['环境配置', '安全扫描', '性能监控', '日志分析', 'SQL优化', '文档生成', '数据清洗', 'API测试', '自动部署', '代码审查'], ...axisStyle },
    series: [{
      type: 'bar', data: [2100, 2800, 3500, 4300, 5100, 6200, 7400, 8600, 10200, 12800],
      itemStyle: { borderRadius: [0, 4, 4, 0] },
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

// ======================== Section 3: 插件开源运营 ========================

export function getStarTrendOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Star数', '下载量'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 50, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: ['4月', '5月', '6月', '7月', '8月'], ...axisStyle },
    yAxis: [
      { type: 'value', name: 'Star', ...axisStyle },
      { type: 'value', name: '下载量', ...axisStyle },
    ],
    series: [
      { name: 'Star数', type: 'line', smooth: true, data: [870, 980, 1050, 1167, 1256], itemStyle: { color: '#FAAD14' }, areaStyle: { color: 'rgba(250,173,20,0.1)' } },
      { name: '下载量', type: 'line', yAxisIndex: 1, smooth: true, data: [18200, 22100, 25800, 28500, 32104], itemStyle: { color: '#5B8DEF' }, areaStyle: { color: 'rgba(91,141,239,0.1)' } },
    ],
  }
}

export function getContributorOption(): EChartsOption {
  const wkDates = genDates(90).filter((_, i) => i % 7 === 0)
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Commit', 'PR', 'Issue'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 40, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: wkDates, ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      { name: 'Commit', type: 'bar', stack: 'total', data: genData(13, 28, 8), itemStyle: { color: '#52C41A' }, barWidth: '40%' },
      { name: 'PR', type: 'bar', stack: 'total', data: genData(13, 12, 4), itemStyle: { color: '#5B8DEF' }, barWidth: '40%' },
      { name: 'Issue', type: 'bar', stack: 'total', data: genData(13, 8, 3), itemStyle: { color: '#FAAD14' }, barWidth: '40%' },
    ],
  }
}

// ======================== Section 4: 沙箱资源 ========================

export function getSandboxTrendOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['拉取总次数', '成功次数'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: genDates(30), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 4 } },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      {
        name: '拉取总次数', type: 'line', smooth: true, data: genData(30, 1750, 300),
        itemStyle: { color: '#5B8DEF' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(91,141,239,0.2)' }, { offset: 1, color: 'rgba(91,141,239,0)' }],
          },
        },
      },
      { name: '成功次数', type: 'line', smooth: true, data: genData(30, 1735, 295), itemStyle: { color: '#52C41A' } },
    ],
  }
}

export function getSandboxDurationOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 30, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: ['<5s', '5-8s', '8-10s', '10-15s', '15-20s', '20-30s', '>30s'], ...axisStyle },
    yAxis: { type: 'value', name: '次数', ...axisStyle },
    series: [{
      type: 'bar',
      data: [320, 890, 560, 280, 95, 28, 5],
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      barWidth: '50%',
      label: { show: true, position: 'top', fontSize: 11, color: '#6B7280' },
    }],
  } as any
}

export function getSandboxHourlyOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 45, right: 20, top: 15, bottom: 30 },
    xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => i + ':00'), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 1 } },
    yAxis: { type: 'value', ...axisStyle },
    series: [{
      type: 'bar',
      data: [12, 8, 5, 3, 2, 4, 15, 45, 89, 120, 135, 142, 128, 110, 98, 105, 118, 125, 98, 72, 56, 38, 22, 15],
      itemStyle: { borderRadius: [3, 3, 0, 0] },
      barWidth: '60%',
    }],
  } as any
}

// ======================== Section 5: 代金券 ========================

export function getVoucherTrendOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['领取人数', '发放金额(元)'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 50, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: genDates(30), ...axisStyle, axisLabel: { ...axisStyle.axisLabel, interval: 4 } },
    yAxis: [
      { type: 'value', name: '人数', ...axisStyle },
      { type: 'value', name: '金额', ...axisStyle },
    ],
    series: [
      { name: '领取人数', type: 'bar', data: genData(30, 115, 25), itemStyle: { color: '#5B8DEF', borderRadius: [3, 3, 0, 0] }, barWidth: '40%' },
      { name: '发放金额(元)', type: 'line', yAxisIndex: 1, smooth: true, data: genData(30, 5800, 1200), itemStyle: { color: '#FAAD14' } },
    ],
  }
}

export function getVoucherPieOption(): EChartsOption {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11, formatter: '{b}\n{d}%' },
      data: [
        { value: 2156, name: '¥50', itemStyle: { color: '#13C2C2' } },
        { value: 1689, name: '¥100', itemStyle: { color: '#52C41A' } },
        { value: 1023, name: '¥200', itemStyle: { color: '#5B8DEF' } },
        { value: 567, name: '¥500', itemStyle: { color: '#FAAD14' } },
        { value: 237, name: '¥1000', itemStyle: { color: '#722ED1' } },
      ],
    }],
  }
}

// ======================== Section 6: 活动统计 ========================

export function getActivityFunnelOption(): EChartsOption {
  return {
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => p.name + '<br/>人数: <b>' + p.value.toLocaleString() + '</b><br/>转化率: <b>' + p.data.rate + '%</b>',
    },
    color: ['#5B8DEF', '#52C41A', '#FAAD14', '#722ED1'],
    series: [{
      type: 'funnel',
      left: '10%',
      width: '70%',
      min: 0,
      max: 8421,
      minSize: '15%',
      maxSize: '100%',
      sort: 'descending',
      gap: 4,
      label: {
        show: true,
        position: 'right',
        formatter: '{name|{b}}\n{val|{c} 人}  {rate|{@rate}%}',
        rich: {
          name: { fontSize: 13, color: '#374151', fontWeight: 600, lineHeight: 22 },
          val: { fontSize: 14, color: '#111827', fontWeight: 700, lineHeight: 22 },
          rate: { fontSize: 12, color: '#9CA3AF', lineHeight: 22 },
        },
      },
      labelLine: { length: 20, lineStyle: { width: 1, type: 'solid', color: '#E5E7EB' } },
      itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 6 },
      emphasis: { label: { fontSize: 14 }, itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.15)' } },
      data: [
        { value: 8421, name: '参与活动' },
        { value: 5234, name: '初章完成' },
        { value: 2876, name: '第二章完成' },
        { value: 1423, name: '终章完成' },
      ],
    }] as any[],
  }
}

export function getActivityTrendOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['初章完成', '第二章完成', '终章完成'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: genDates(14), ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      { name: '初章完成', type: 'line', smooth: true, data: genData(14, 180, 30), itemStyle: { color: '#52C41A' } },
      { name: '第二章完成', type: 'line', smooth: true, data: genData(14, 95, 20), itemStyle: { color: '#FAAD14' } },
      { name: '终章完成', type: 'line', smooth: true, data: genData(14, 45, 10), itemStyle: { color: '#722ED1' } },
    ],
  }
}

export function getActivityConvOption(): EChartsOption {
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 40, top: 15, bottom: 25 },
    xAxis: { type: 'value', max: 100, axisLabel: { ...axisStyle.axisLabel, formatter: '{value}%' }, axisLine: axisStyle.axisLine, splitLine: axisStyle.splitLine },
    yAxis: { type: 'category', data: ['参与→初章', '初章→第二章', '第二章→终章', '整体(参与→终章)'], ...axisStyle },
    series: [{
      type: 'bar', data: [62.2, 55.0, 49.4, 16.9],
      itemStyle: { borderRadius: [0, 4, 4, 0] },
      barWidth: '50%',
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12, fontWeight: 600, color: '#374151' },
    }] as any[],
  }
}

// ======================== User Data (Section 2 用户明细) ========================

export interface UserRecord {
  id: string
  name: string
  email: string
  phone: string
  company: string
  agents: string[]
  agentCount: number
  deployCount: number
  status: 'active' | 'low' | 'churned'
  regDate: string
  lastActive: string
  totalDays: number
  continuousDays: number
  totalAgentCalls: number
  skillCalls: number
  mcpCalls: number
  openCalls: number
  voucherAmount: number
  voucherCount: number
}

export const users: UserRecord[] = [
  { id: 'U-10032', name: '张伟', email: 'zhangw@dev.cn', phone: '138****5621', company: '智云科技', agents: ['opencode linux', '码道 IDE windows', 'workbuddy windows', 'codex windows', 'DSH'], agentCount: 5, deployCount: 23, status: 'active', regDate: '2026-07-15', lastActive: '2026-09-01 07:45', totalDays: 48, continuousDays: 12, totalAgentCalls: 186, skillCalls: 92, mcpCalls: 54, openCalls: 40, voucherAmount: 500, voucherCount: 2 },
  { id: 'U-10045', name: '李娜', email: 'lina@tech.io', phone: '139****8832', company: '数联科技', agents: ['opencode windows', '码道 CLI', 'officeace windows'], agentCount: 3, deployCount: 12, status: 'active', regDate: '2026-06-22', lastActive: '2026-09-01 07:30', totalDays: 71, continuousDays: 5, totalAgentCalls: 95, skillCalls: 48, mcpCalls: 30, openCalls: 17, voucherAmount: 200, voucherCount: 1 },
  { id: 'U-10078', name: '王强', email: 'wangq@code.org', phone: '137****4456', company: '极客工作室', agents: ['opencode linux', 'opencode windows', '码道 IDE windows', '码道 work windows', 'workbuddy windows', 'codex windows', 'officeace windows', 'AtomCode'], agentCount: 8, deployCount: 45, status: 'active', regDate: '2026-08-01', lastActive: '2026-09-01 08:15', totalDays: 31, continuousDays: 20, totalAgentCalls: 312, skillCalls: 156, mcpCalls: 98, openCalls: 58, voucherAmount: 1000, voucherCount: 3 },
  { id: 'U-10102', name: '刘洋', email: 'liuy@dev.cn', phone: '135****7790', company: '个人开发者', agents: ['码道 CLI', 'openclaw'], agentCount: 2, deployCount: 5, status: 'low', regDate: '2026-05-10', lastActive: '2026-08-28 22:15', totalDays: 15, continuousDays: 0, totalAgentCalls: 28, skillCalls: 12, mcpCalls: 9, openCalls: 7, voucherAmount: 100, voucherCount: 1 },
  { id: 'U-10135', name: '陈静', email: 'chenj@tech.io', phone: '136****2200', company: '新创互联', agents: ['opencode windows'], agentCount: 1, deployCount: 3, status: 'active', regDate: '2026-08-20', lastActive: '2026-09-01 06:50', totalDays: 12, continuousDays: 8, totalAgentCalls: 21, skillCalls: 10, mcpCalls: 7, openCalls: 4, voucherAmount: 50, voucherCount: 1 },
  { id: 'U-10167', name: '赵明', email: 'zhaom@code.org', phone: '133****9988', company: '个人开发者', agents: [], agentCount: 0, deployCount: 0, status: 'churned', regDate: '2026-04-18', lastActive: '2026-07-20 14:30', totalDays: 8, continuousDays: 0, totalAgentCalls: 0, skillCalls: 0, mcpCalls: 0, openCalls: 0, voucherAmount: 0, voucherCount: 0 },
  { id: 'U-10189', name: '孙丽', email: 'sunli@dev.cn', phone: '132****6677', company: '云栈信息', agents: ['opencode linux', '码道 IDE windows', '码道 work windows', 'workbuddy windows', 'codex windows', 'officeace windows'], agentCount: 6, deployCount: 31, status: 'active', regDate: '2026-07-30', lastActive: '2026-09-01 07:20', totalDays: 33, continuousDays: 15, totalAgentCalls: 218, skillCalls: 108, mcpCalls: 67, openCalls: 43, voucherAmount: 800, voucherCount: 2 },
  { id: 'U-10203', name: '周杰', email: 'zhouj@tech.io', phone: '131****3344', company: '极速开发', agents: ['opencode windows', '码道 CLI', 'hermes', 'AtomCode'], agentCount: 4, deployCount: 8, status: 'active', regDate: '2026-08-25', lastActive: '2026-09-01 08:30', totalDays: 7, continuousDays: 7, totalAgentCalls: 62, skillCalls: 30, mcpCalls: 19, openCalls: 13, voucherAmount: 200, voucherCount: 1 },
]

export function getUserPieOption(user: UserRecord): EChartsOption {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['35%', '60%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11, formatter: '{b}\n{c}次' },
      data: [
        { value: user.skillCalls, name: 'Skill调用', itemStyle: { color: '#5B8DEF' } },
        { value: user.mcpCalls, name: 'MCP调用', itemStyle: { color: '#52C41A' } },
        { value: user.openCalls, name: '开放能力调用', itemStyle: { color: '#FAAD14' } },
      ],
    }],
  }
}

export const colorPaletteExport = colorPalette
export const axisStyleExport = axisStyle