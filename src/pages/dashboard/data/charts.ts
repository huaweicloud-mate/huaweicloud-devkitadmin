import type { EChartsOption } from 'echarts'

const axisStyle = {
  axisLine: { lineStyle: { color: '#E5E7EB' } },
  axisLabel: { color: '#9CA3AF', fontSize: 11 },
  splitLine: { lineStyle: { color: '#F3F4F6' } },
}

const colorPalette = ['#5B8DEF', '#52C41A', '#FAAD14', '#722ED1', '#13C2C2']

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
      { name: '环比增长%', type: 'line', yAxisIndex: 1, data: data.map(d => d.momRate), itemStyle: { color: '#52C41A' } },
      { name: '同比增长%', type: 'line', yAxisIndex: 1, data: data.map(d => d.yoyRate), itemStyle: { color: '#FAAD14' } },
    ],
  }
}

/** 下载渠道占比饼图（接收 API 数据） */
export function buildDownloadPieOption(data: Array<{ channel: string; count: number; percentage: number }>): EChartsOption {
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '52%'],
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
  const lineColors: Record<string, string> = { skill: '#5B8DEF', mcp: '#52C41A', total: '#722ED1' }
  const lineNames: Record<string, string> = { skill: 'Skill调用', mcp: 'MCP调用', total: '开放能力调用' }
  const dates = [...new Set(data.map(item => item.date))].sort()
  const countOf = (cap: string, date: string) =>
    data.find(i => i.date === date && i.capability === cap)?.callCount || 0

  const lines: Array<{ key: string; data: number[] }> = [
    { key: 'skill', data: dates.map(d => countOf('skill', d)) },
    { key: 'mcp', data: dates.map(d => countOf('mcp', d)) },
    { key: 'total', data: dates.map(d => countOf('skill', d) + countOf('mcp', d) + countOf('cli', d)) },
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

/** 开放能力分布饼图（仅展示 MCP / CLI 占比） */
export function buildCapabilityPieOption(data: Array<{ capability: string; callCount: number; percentage: number }>): EChartsOption {
  const capColors: Record<string, string> = { mcp: '#52C41A', cli: '#FAAD14' }
  const items = data.filter(d => d.capability === 'mcp' || d.capability === 'cli')
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { fontSize: 11 },
      data: items.map(item => ({
        value: item.callCount,
        name: item.capability,
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
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
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
      formatter: (p: any) => p.name + '<br/>人数: <b>' + p.value.toLocaleString() + '</b><br/>转化率: <b>' + p.data.rate + '%</b>',
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
        formatter: '{name|{b}}\n{val|{c} 人} {rate|{@rate}%%}',
        rich: {
          name: { fontSize: 13, color: '#374151', fontWeight: 600, lineHeight: 22 },
          val: { fontSize: 14, color: '#111827', fontWeight: 700, lineHeight: 22 },
          rate: { fontSize: 12, color: '#9CA3AF', lineHeight: 22 },
        },
      },
      labelLine: { length: 20, lineStyle: { width: 1, type: 'solid', color: '#E5E7EB' } },
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

/** 活动完成趋势（接收 API 三章节数据） */
export function buildActivityTrendOption(
  chapter1: Array<{ date: string; value: number }>,
  chapter2: Array<{ date: string; value: number }>,
  chapter3: Array<{ date: string; value: number }>,
): EChartsOption {
  const dates = chapter1.map(p => p.date)
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['初章完成', '进阶章完成', '终章完成'], right: 0, top: 0, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 20, top: 35, bottom: 30 },
    xAxis: { type: 'category', data: dates, ...axisStyle },
    yAxis: { type: 'value', ...axisStyle },
    series: [
      { name: '初章完成', type: 'line', smooth: true, data: chapter1.map(p => p.value), itemStyle: { color: '#52C41A' } },
      { name: '进阶章完成', type: 'line', smooth: true, data: chapter2.map(p => p.value), itemStyle: { color: '#FAAD14' } },
      { name: '终章完成', type: 'line', smooth: true, data: chapter3.map(p => p.value), itemStyle: { color: '#722ED1' } },
    ],
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
