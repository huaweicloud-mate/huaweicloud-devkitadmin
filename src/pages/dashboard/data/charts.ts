import type { EChartsOption } from 'echarts'

const axisStyle = {
  axisLine: { lineStyle: { color: '#E5E7EB' } },
  axisLabel: { color: '#9CA3AF', fontSize: 11 },
  splitLine: { lineStyle: { color: '#F3F4F6' } },
}

const colorPalette = ['#5B8DEF', '#52C41A', '#FAAD14', '#722ED1', '#13C2C2']

/** 活动阶段配色（按阶段序号循环） */
const ACTIVITY_STAGE_COLORS = ['#52C41A', '#FAAD14', '#722ED1', '#13C2C2', '#FF4D4F', '#5B8DEF']

/** 数据为空时的占位图 */
export function getEmptyChartOption(): EChartsOption {
  return {
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'middle',
      textStyle: { color: '#9CA3AF', fontSize: 14, fontWeight: 400 },
    },
  }
}

// ======================== Section 1: 业务核心指标 ========================

/** DAU/MAU 趋势折线图（接收 API 数据） */
export function buildDauTrendOption(data: Array<{ date: string; dau: number; mau: number }>): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['DAU', 'MAU'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 40, right: 20, top: 35, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, interval: Math.max(0, Math.floor(data.length / 8)) },
    },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      {
        name: 'DAU', type: 'line', smooth: true, data: data.map(d => d.dau),
        itemStyle: { color: '#5B8DEF' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(91,141,239,0.25)' }, { offset: 1, color: 'rgba(91,141,239,0)' }],
          },
        },
      },
      { name: 'MAU', type: 'line', smooth: true, data: data.map(d => d.mau), itemStyle: { color: '#722ED1' } },
    ],
  }
}

/** Agent 接入分布横向柱状图（接收 API 数据） */
export function buildAgentDistributionOption(data: Array<{ name: string; count: number }>): EChartsOption {
  const sorted = [...data].sort((a, b) => a.count - b.count)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 40, top: 10, bottom: 25 },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: {
      type: 'category',
      data: sorted.map(d => d.name),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: sorted.map(d => ({
        value: d.count,
        itemStyle: { color: '#5B8DEF', borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

/** devkit 客户端版本分布（横向柱状，按用户数） */
export function buildVersionDistributionOption(data: Array<{ version: string; count: number }>): EChartsOption {
  const sorted = [...data].sort((a, b) => a.count - b.count)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 130, right: 40, top: 10, bottom: 25 },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: {
      type: 'category',
      data: sorted.map(d => d.version),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: sorted.map(d => ({
        value: d.count,
        itemStyle: { color: '#34D399', borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

/** 新增用户趋势（柱状 + 环比/同比双折线，接收 API 数据） */
export function buildNewUserTrendOption(data: Array<{ month: string; newUserCount: number; momRate: number | null; yoyRate: number | null }>): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['新增用户', '环比增长%', '同比增长%'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 45, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: data.map(d => d.month), ...axisStyle },
    yAxis: [
      { type: 'value', name: '人数', ...axisStyle },
      { type: 'value', name: '增长率%', ...axisStyle, axisLabel: { ...axisStyle.axisLabel, formatter: '{value}%' } },
    ],
    series: [
      { name: '新增用户', type: 'bar', data: data.map(d => d.newUserCount), itemStyle: { color: '#5B8DEF', borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '环比增长%', type: 'line', yAxisIndex: 1, data: data.map(d => d.momRate == null ? null : Math.round(d.momRate)), itemStyle: { color: '#52C41A' } },
      { name: '同比增长%', type: 'line', yAxisIndex: 1, data: data.map(d => d.yoyRate == null ? null : Math.round(d.yoyRate)), itemStyle: { color: '#FAAD14' } },
    ],
  }
}

/** 下载渠道占比饼图（接收 API 数据） */
export function buildDownloadPieOption(data: Array<{ channel: string; count: number; percentage: number }>): EChartsOption {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie', percentPrecision: 0, radius: ['45%', '70%'], center: ['50%', '52%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11, formatter: '{b}\n{d}%' },
      data: data.map((d, i) => ({
        value: d.count,
        name: d.channel,
        itemStyle: { color: colorPalette[i % colorPalette.length] },
      })),
    }],
  }
}

/** 插件下载量趋势（GitHub + npm 双折线，接收 API 数据） */
export function buildDownloadTrendOption(data: Array<{ date: string; npmDownloads: number; githubDownloads: number | null }>): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['GitHub', 'npm'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 20, top: 35, bottom: 30 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, interval: Math.max(0, Math.floor(data.length / 8)) },
    },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      { name: 'GitHub', type: 'line', smooth: true, data: data.map(d => d.githubDownloads), itemStyle: { color: '#5B8DEF' } },
      { name: 'npm', type: 'line', smooth: true, data: data.map(d => d.npmDownloads), itemStyle: { color: '#52C41A' } },
    ],
  }
}

// ======================== Section 2: 开放能力 ========================

export function buildCapabilityTrendOption(data: Array<{ date: string; capability: string; callCount: number }>): EChartsOption {
  const lineColors: Record<string, string> = { skill: '#5B8DEF', mcp: '#52C41A', cli: '#FAAD14' }
  const lineNames: Record<string, string> = { skill: 'Skill调用', mcp: 'MCP调用', cli: 'CLI调用' }
  const dates = [...new Set(data.map(item => item.date))].sort()
  const countOf = (cap: string, date: string) =>
    data.find(i => i.date === date && i.capability === cap)?.callCount || 0

  const lines: Array<{ key: string; data: number[] }> = [
    { key: 'skill', data: dates.map(d => countOf('skill', d)) },
    { key: 'mcp', data: dates.map(d => countOf('mcp', d)) },
    { key: 'cli', data: dates.map(d => countOf('cli', d)) },
  ]
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: lines.map(l => lineNames[l.key]), right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 20, top: 35, bottom: 30 },
    xAxis: {
      type: 'category',
      data: dates,
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, interval: Math.max(0, Math.floor(dates.length / 10)) },
    },
    yAxis: { type: 'value', ...axisStyle },
    series: lines.map(l => ({
      name: lineNames[l.key],
      type: 'line',
      smooth: true,
      data: l.data,
      itemStyle: { color: lineColors[l.key] || '#5B8DEF' },
    })),
  }
}

/** 开放能力分布饼图（展示 Skill / MCP / CLI 占比） */
export function buildCapabilityPieOption(data: Array<{ capability: string; callCount: number; percentage: number }>): EChartsOption {
  const capColors: Record<string, string> = { skill: '#5B8DEF', mcp: '#52C41A', cli: '#FAAD14' }
  const capNames: Record<string, string> = { skill: 'Skill', mcp: 'MCP', cli: 'CLI' }
  const items = data.filter(d => d.capability === 'skill' || d.capability === 'mcp' || d.capability === 'cli')
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      percentPrecision: 0,
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11 },
      data: items.map(item => ({
        value: item.callCount,
        name: capNames[item.capability] || item.capability,
        itemStyle: { color: capColors[item.capability] || '#5B8DEF' },
      })),
    }],
  }
}

export function buildSkillRankOption(data: Array<{ rank: number; skillName: string; callCount: number; percentage: number }>): EChartsOption {
  const sorted = [...data].sort((a, b) => a.callCount - b.callCount)
  const skills = sorted.map(item => item.skillName)
  const counts = sorted.map(item => item.callCount)

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 120, right: 30, top: 10, bottom: 25 },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: { type: 'category', data: skills, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, fontSize: 11 } },
    series: [{
      type: 'bar',
      data: counts.map(v => ({
        value: v,
        itemStyle: { color: '#5B8DEF', borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

// ======================== Section 4: 沙箱资源 ========================

/** 沙箱拉取趋势折线图（接收 API 数据） */
export function buildSandboxTrendOption(daily: Array<{ date: string; value: number }>, events: Array<{ date: string; value: number }>): EChartsOption {
  const dates = daily.map(d => d.date)
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['日去重用户数', '事件总次数'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 20, top: 35, bottom: 30 },
    xAxis: {
      type: 'category',
      data: dates,
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, interval: Math.max(0, Math.floor(dates.length / 10)) },
    },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      {
        name: '日去重用户数', type: 'line', smooth: true,
        data: daily.map(d => d.value),
        itemStyle: { color: '#5B8DEF' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(91,141,239,0.2)' }, { offset: 1, color: 'rgba(91,141,239,0)' }],
          },
        },
      },
      { name: '事件总次数', type: 'line', smooth: true, data: events.map(d => d.value), itemStyle: { color: '#52C41A' } },
    ],
  }
}

/** 沙箱创建耗时分布柱状图（接收 API 数据） */
export function buildSandboxDurationOption(buckets: Array<{ label: string; order: number; count: number }>): EChartsOption {
  const sorted = [...buckets].sort((a, b) => a.order - b.order)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 30, top: 20, bottom: 30 },
    xAxis: { type: 'category', data: sorted.map(b => b.label), ...axisStyle },
    yAxis: { type: 'value', name: '次数', ...axisStyle },
    series: [{
      type: 'bar',
      data: sorted.map(b => ({
        value: b.count,
        itemStyle: { color: '#5B8DEF', borderRadius: [4, 4, 0, 0] },
      })),
      barWidth: '50%',
      label: { show: true, position: 'top', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

/** 每小时沙箱拉取柱状图（接收 API 数据） */
export function buildSandboxHourlyOption(hourly: Array<{ hour: number; count: number }>): EChartsOption {
  const full24 = Array.from({ length: 24 }, (_, h) => {
    const found = hourly.find(p => p.hour === h)
    return found ? found.count : 0
  })
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 45, right: 20, top: 15, bottom: 30 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => i + ':00'),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, interval: 1 },
    },
    yAxis: { type: 'value', ...axisStyle },
    series: [{
      type: 'bar',
      data: full24.map(v => ({
        value: v,
        itemStyle: { color: '#5B8DEF', borderRadius: [3, 3, 0, 0] },
      })),
      barWidth: '60%',
    }] as any[],
  }
}

// ======================== Section 4.5: 沙箱观测（Issue #134，#121 后端） ========================

/** 沙箱复连间隔分布（6 桶柱状 + p50/p90 标注线，秒） */
export function buildSandboxRevisitIntervalOption(
  buckets: Array<{ label: string; order: number; count: number }>,
  p50Seconds: number | null,
  p90Seconds: number | null,
): EChartsOption {
  const sorted = [...buckets].sort((a, b) => a.order - b.order)
  const markLines: any[] = []
  if (p50Seconds != null) {
    markLines.push({ yAxis: p50Seconds, name: 'p50' })
  }
  if (p90Seconds != null) {
    markLines.push({ yAxis: p90Seconds, name: 'p90' })
  }
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['用户数'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 30, top: 30, bottom: 45 },
    xAxis: { type: 'category', data: sorted.map(b => b.label), ...axisStyle },
    yAxis: { type: 'value', name: '用户数', ...axisStyle },
    series: [{
      name: '用户数',
      type: 'bar',
      data: sorted.map(b => ({
        value: b.count,
        itemStyle: { color: '#5B8DEF', borderRadius: [4, 4, 0, 0] },
      })),
      barWidth: '50%',
      label: { show: true, position: 'top', fontSize: 11, color: '#6B7280' },
      markLine: markLines.length
        ? {
            symbol: 'none',
            silent: true,
            lineStyle: { type: 'dashed', color: '#FAAD14' },
            label: { formatter: '{b}: {c}s', fontSize: 11, color: '#FAAD14' },
            data: markLines,
          }
        : undefined,
    }] as any[],
  }
}

/** 沙箱闲置天数分布（柱状，>24h/72h 桶高亮为橙/红） */
export function buildSandboxIdleOption(
  buckets: Array<{ label: string; order: number; count: number }>,
): EChartsOption {
  const sorted = [...buckets].sort((a, b) => a.order - b.order)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 50, right: 30, top: 20, bottom: 45 },
    xAxis: { type: 'category', data: sorted.map(b => b.label), ...axisStyle },
    yAxis: { type: 'value', name: '沙箱数', ...axisStyle },
    series: [{
      type: 'bar',
      data: sorted.map(b => ({
        value: b.count,
        itemStyle: {
          // #134 review fix: 按 order 判定（后端桶升序，L1-2 <24h 蓝 / L3-4 24h-72h 橙 / L5+ ≥72h 红）
          color: (b.order ?? 99) >= 5 ? '#FF4D4F' : (b.order ?? 99) >= 3 ? '#FAAD14' : '#5B8EFF',
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barWidth: '50%',
      label: { show: true, position: 'top', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

/** 沙箱失败率逐日趋势（成功率% 折线 + 失败次数柱，双轴） */
export function buildSandboxErrorTrendOption(
  daily: Array<{ date: string; total: number; success: number; successRate: number }>,
): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['失败次数', '成功率%'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 50, top: 35, bottom: 30 },
    xAxis: {
      type: 'category',
      data: daily.map(d => d.date),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, interval: Math.max(0, Math.floor(daily.length / 10)) },
    },
    yAxis: [
      { type: 'value', name: '次数', ...axisStyle },
      { type: 'value', name: '成功率%', max: 100, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, formatter: '{value}%' } },
    ],
    series: [
      {
        name: '失败次数',
        type: 'bar',
        data: daily.map(d => Math.max(0, d.total - d.success)),
        itemStyle: { color: '#FF4D4F', borderRadius: [3, 3, 0, 0] },
        barWidth: '40%',
      },
      {
        name: '成功率%',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: daily.map(d => +d.successRate.toFixed(1)),
        itemStyle: { color: '#52C41A' },
      },
    ],
  }
}

/** 沙箱 error_code Top10（横向柱状） */
export function buildSandboxErrorCodeOption(
  items: Array<{ errorCode: string; count: number }>,
): EChartsOption {
  const sorted = [...items].sort((a, b) => a.count - b.count)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 110, right: 40, top: 10, bottom: 25 },
    xAxis: { type: 'value', ...axisStyle },
    yAxis: {
      type: 'category',
      data: sorted.map(d => d.errorCode),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: sorted.map(d => ({
        value: d.count,
        itemStyle: { color: '#FF4D4F', borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

/** 沙箱成本拆分（template×flavor create 次数柱状，Top10） */
export function buildSandboxCostOption(
  items: Array<{ templateId: string; flavorId: string; createCount: number; distinctUsers: number }>,
): EChartsOption {
  const sorted = [...items].sort((a, b) => b.createCount - a.createCount).slice(0, 10).reverse()
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (ps: any) => {
        const p = Array.isArray(ps) ? ps[0] : ps
        const it = sorted[p.dataIndex]
        return `${p.name}<br/>create 次数: <b>${p.value}</b><br/>去重用户数: <b>${it?.distinctUsers ?? '--'}</b>`
      },
    },
    grid: { left: 150, right: 40, top: 10, bottom: 25 },
    xAxis: { type: 'value', name: 'create 次数', ...axisStyle },
    yAxis: {
      type: 'category',
      data: sorted.map(d => `${d.templateId}·${d.flavorId}`),
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, fontSize: 11 },
    },
    series: [{
      type: 'bar',
      data: sorted.map(d => ({
        value: d.createCount,
        itemStyle: { color: '#722ED1', borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: '55%',
      label: { show: true, position: 'right', fontSize: 11, color: '#6B7280' },
    }] as any[],
  }
}

// ======================== Section 5: 代金券 ========================

/** 代金券领取趋势（接收 API 数据，amount 为分，需 /100 转元） */
export function buildVoucherTrendOption(
  daily: Array<{ date: string; count: number; amount: number }>,
): EChartsOption {
  const dates = daily.map(d => d.date)
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['领取人数', '发放金额(元)'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 50, top: 35, bottom: 30 },
    xAxis: {
      type: 'category', data: dates,
      ...axisStyle,
      axisLabel: { ...axisStyle.axisLabel, interval: Math.max(0, Math.floor(dates.length / 10)) },
    },
    yAxis: [
      { type: 'value', name: '人数', ...axisStyle },
      { type: 'value', name: '金额(元)', ...axisStyle },
    ],
    series: [
      {
        name: '领取人数', type: 'bar',
        data: daily.map(d => d.count),
        itemStyle: { color: '#5B8DEF', borderRadius: [3, 3, 0, 0] },
        barWidth: '40%',
      },
      {
        name: '发放金额(元)', type: 'line', yAxisIndex: 1, smooth: true,
        data: daily.map(d => d.amount / 100),
        itemStyle: { color: '#FAAD14' },
      },
    ],
  }
}

/** 代金券面额分布（接收 API 数据，faceAmount 为分，需 /100 转元） */
export function buildVoucherPieOption(
  items: Array<{ faceAmount: number; claimCount: number; percentage: number }>,
): EChartsOption {
  const palette = ['#13C2C2', '#52C41A', '#5B8DEF', '#FAAD14', '#722ED1']
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie', percentPrecision: 0, radius: ['40%', '65%'], center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11, formatter: '{b}\n{d}%' },
      data: items.map((item, index) => ({
        value: item.claimCount,
        name: `¥${item.faceAmount / 100}`,
        itemStyle: { color: palette[index % palette.length] },
      })),
    }],
  }
}

// ======================== Section 6: 活动统计 ========================

/** 活动转化漏斗（接收 API funnel 数据） */
export function buildActivityFunnelOption(
  funnel: Array<{ name: string; value: number; rate: number }>,
): EChartsOption {
  const maxVal = funnel.length > 0 ? funnel[0].value : 10000
  const palette = ['#5B8DEF', '#52C41A', '#FAAD14', '#722ED1']
  return {
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => p.name + '<br/>人数: <b>' + p.value.toLocaleString() + '</b><br/>转化率: <b>' + Math.round(p.data.rate) + '%</b>',
    },
    color: palette,
    series: [{
      type: 'funnel',
      left: '10%',
      width: '70%',
      min: 0,
      max: maxVal,
      minSize: '15%',
      maxSize: '100%',
      sort: 'descending',
      gap: 4,
      label: {
        show: true,
        position: 'right',
        formatter: (p: any) => `{name|${p.name}}\n{val|${p.value.toLocaleString()} 人} {rate|${Math.round(p.data.rate)}%}`,
        rich: {
          name: { fontSize: 13, color: '#374151', fontWeight: 600, lineHeight: 22 },
          val: { fontSize: 14, color: '#111827', fontWeight: 700, lineHeight: 22 },
          rate: { fontSize: 12, color: '#9CA3AF', lineHeight: 22 },
        },
      },
      labelLine: { length: 20, lineStyle: { width: 1, type: 'solid', color: '#E5E7EB' } },
      labelLayout: (p: any) => {
        const pts = p.labelLinePoints
        if (!pts || pts.length < 2) return {}
        if (p.dataIndex !== 0 && p.dataIndex !== funnel.length - 1) return {}
        const anchor = pts[0]
        const run = 50
        const drop = +(run * Math.tan(15 * Math.PI / 180)).toFixed(1)
        const elbow = [anchor[0] + run, anchor[1] + drop]
        return {
          x: elbow[0] + 6,
          y: elbow[1],
          align: 'left',
          verticalAlign: 'middle',
          labelLinePoints: [[anchor[0], anchor[1]], elbow],
        }
      },
      itemStyle: { borderColor: '#fff', borderWidth: 2, borderRadius: 6 },
      emphasis: {
        label: { fontSize: 14 },
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.15)' },
      },
      data: funnel.map((stage, i) => ({
        value: stage.value,
        name: stage.name,
        rate: stage.rate,
        itemStyle: { color: palette[i % palette.length] },
      })),
    }] as any[],
  }
}

/**
 * 活动趋势（单活动·拆两张图）：审批通过趋势（实线），各阶段一条线
 */
export function buildActivityTrendApprovedOption(
  stages: Array<{ key: string; label: string; points: Array<{ date: string; value: number }> }>,
): EChartsOption {
  return buildTrendLines(stages, false)
}

/**
 * 活动趋势（单活动·拆两张图）：提交趋势（虚线），各阶段一条线
 */
export function buildActivityTrendSubmittedOption(
  stages: Array<{ key: string; label: string; points: Array<{ date: string; value: number }> }>,
): EChartsOption {
  return buildTrendLines(stages, true)
}

function buildTrendLines(
  stages: Array<{ key: string; label: string; points: Array<{ date: string; value: number }> }>,
  submitted: boolean,
): EChartsOption {
  const dateSet: Set<string> = new Set()
  for (const s of stages) for (const p of s.points) dateSet.add(p.date)
  const dates = [...dateSet].sort()
  const series = stages.map((s, i) => {
    const byDate = new Map(s.points.map(p => [p.date, p.value]))
    return {
      name: submitted ? `${s.label}提交` : `${s.label}审批`,
      type: 'line' as const,
      smooth: true,
      lineStyle: submitted ? { type: 'dashed' as const } : undefined,
      data: dates.map(d => byDate.get(d) ?? 0),
      itemStyle: { color: ACTIVITY_STAGE_COLORS[i % ACTIVITY_STAGE_COLORS.length] },
    }
  })
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: series.map(s => s.name), right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: dates, ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series,
  }
}

/**
 * 活动趋势（多活动·拆两张图）：审批通过对比（实线），每活动 × 每阶段一条线
 */
export function buildActivityTrendMultiApprovedOption(
  activities: Array<{
    name: string
    stages: Array<{ key: string; label: string; points: Array<{ date: string; value: number }> }>
  }>,
): EChartsOption {
  return buildTrendLinesAggregated(activities, false)
}

/**
 * 活动趋势（多活动·拆两张图）：提交对比（虚线），每活动 × 每阶段一条线
 */
export function buildActivityTrendMultiSubmittedOption(
  activities: Array<{
    name: string
    stages: Array<{ key: string; label: string; points: Array<{ date: string; value: number }> }>
  }>,
): EChartsOption {
  return buildTrendLinesAggregated(activities, true)
}

function buildTrendLinesAggregated(
  activities: Array<{
    name: string
    stages: Array<{ key: string; label: string; points: Array<{ date: string; value: number }> }>
  }>,
  submitted: boolean,
): EChartsOption {
  const dateSet: Set<string> = new Set()
  for (const a of activities) for (const s of a.stages) for (const p of s.points) dateSet.add(p.date)
  const dates = [...dateSet].sort()
  const actLineTypes = ['solid', 'dashed', 'dotted'] as const
  const series: any[] = []
  for (const [ai, act] of activities.entries()) {
    for (const [si, st] of act.stages.entries()) {
      const byDate = new Map(st.points.map(p => [p.date, p.value]))
      series.push({
        name: `${act.name}·${st.label}${submitted ? '提交' : '审批'}`,
        type: 'line',
        smooth: true,
        data: dates.map(d => byDate.get(d) ?? 0),
        lineStyle: { type: submitted ? 'dotted' : actLineTypes[ai % actLineTypes.length] },
        itemStyle: { color: ACTIVITY_STAGE_COLORS[si % ACTIVITY_STAGE_COLORS.length] },
      })
    }
  }
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: series.map(s => s.name), right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: dates, ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series,
  }
}


/** 活动转化率对比（接收 API stages 数据，按值动态着色） */
export function buildActivityConvOption(
  stages: Array<{ label: string; rate: number }>,
): EChartsOption {
  const labels = stages.map(s => s.label)
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 100, right: 40, top: 15, bottom: 25 },
    xAxis: {
      type: 'value', max: 100,
      axisLabel: { ...axisStyle.axisLabel, formatter: '{value}%' },
      axisLine: axisStyle.axisLine,
      splitLine: axisStyle.splitLine,
    },
    yAxis: { type: 'category', data: labels, ...axisStyle },
    series: [{
      type: 'bar',
      data: stages.map(s => ({
        value: s.rate,
        itemStyle: {
          color: s.rate >= 50 ? '#52C41A' : s.rate >= 30 ? '#FAAD14' : '#FF4D4F',
          borderRadius: [0, 4, 4, 0],
        },
      })),
      barWidth: '50%',
      label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12, fontWeight: 600, color: '#374151' },
    }] as any[],
  }
}

/** 插件开源运营：Star 数与下载量组合趋势（双轴） */
export function buildStarDownloadTrendOption(
  data: Array<{ date: string; stars: number; downloads: number }>,
): EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: 60, right: 60, top: 30, bottom: 55 },
    xAxis: { type: 'category', data: data.map(d => d.date), ...axisStyle },
    yAxis: [
      { type: 'value', name: 'Star 数', ...axisStyle },
      { type: 'value', name: 'npm 下载量', ...axisStyle },
    ],
    series: [
      {
        name: 'GitHub Star 数',
        type: 'line',
        data: data.map(d => d.stars),
        itemStyle: { color: '#FAAD14' },
        smooth: true,
      },
      {
        name: 'npm 下载量',
        type: 'bar',
        yAxisIndex: 1,
        data: data.map(d => d.downloads),
        itemStyle: { color: '#5B8DEF' },
      },
    ] as any[],
  }
}
/** 插件开源运营：贡献者活跃（分组柱状图） */
export function buildContributorActivityOption(
  data: Array<{ author: string; commits: number; prs: number; issues: number }>,
): EChartsOption {
  const authors = data.map(d => d.author)
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    grid: { left: 50, right: 20, top: 30, bottom: 55 },
    xAxis: { type: 'category', data: authors, ...axisStyle },
    yAxis: { type: 'value', name: '数量', ...axisStyle },
    series: [
      { name: 'Commit', type: 'bar', data: data.map(d => d.commits), itemStyle: { color: '#5B8DEF' } },
      { name: 'PR', type: 'bar', data: data.map(d => d.prs), itemStyle: { color: '#52C41A' } },
      { name: 'Issue', type: 'bar', data: data.map(d => d.issues), itemStyle: { color: '#FAAD14' } },
    ],
  }
}

// ==================== 服务健康（#120） ====================

/** 健康趋势图（近 7 天调用量 + 错误率双 Y 轴） */
export function buildHealthTrendOption(data: Array<{ date: string; totalCalls: number; errorRate: number }>): EChartsOption {
  if (!data.length) return getEmptyChartOption()
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['调用量', '错误率(%)'], bottom: 0 },
    grid: { top: 40, left: 60, right: 60, bottom: 40 },
    xAxis: { type: 'category', data: data.map(d => d.date.slice(5)), boundaryGap: false },
    yAxis: [
      { type: 'value', name: '调用量' },
      { type: 'value', name: '错误率(%)', max: 100 },
    ],
    series: [
      {
        name: '调用量', type: 'line', smooth: true, yAxisIndex: 0,
        data: data.map(d => d.totalCalls), itemStyle: { color: '#5B8EFF' },
      },
      {
        name: '错误率(%)', type: 'line', smooth: true, yAxisIndex: 1,
        data: data.map(d => d.errorRate), itemStyle: { color: '#FF4D4F' },
      },
    ],
  }
}

/** 错误码 Top10 横向柱状图 */
export function buildHealthErrorTopOption(data: Array<{ errorCode: string; count: number }>): EChartsOption {
  if (!data.length) return getEmptyChartOption()
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 10)
  return {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, left: 180, right: 40, bottom: 30 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: sorted.map(d => d.errorCode).reverse(), axisLabel: { fontSize: 11 } },
    series: [{
      type: 'bar',
      data: sorted.map(d => d.count).reverse(),
      itemStyle: { color: '#FF4D4F', borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right', fontSize: 11 },
    }],
  }
}

/** 慢接口 Top10 横向柱状图（按 p95 耗时） */
export function buildHealthSlowTopOption(data: Array<{ path: string; host: string; p95: number }>): EChartsOption {
  if (!data.length) return getEmptyChartOption()
  const sorted = [...data].sort((a, b) => b.p95 - a.p95).slice(0, 10)
  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const d = sorted[params[0].dataIndex]
        return `${d?.path || ''}<br/>host: ${d?.host || ''}<br/>p95: ${d?.p95 || 0}ms`
      },
    },
    grid: { top: 10, left: 220, right: 60, bottom: 30 },
    xAxis: { type: 'value', name: 'ms' },
    yAxis: { type: 'category', data: sorted.map(d => d.path.slice(0, 30)).reverse(), axisLabel: { fontSize: 10 } },
    series: [{
      type: 'bar',
      data: sorted.map(d => d.p95).reverse(),
      itemStyle: { color: '#FAAD14', borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right', fontSize: 10, formatter: '{c}ms' },
    }],
  }
}
