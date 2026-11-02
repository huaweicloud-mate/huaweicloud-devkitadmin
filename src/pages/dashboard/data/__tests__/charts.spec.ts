
import { buildSandboxIdleOption } from '../charts'

// Issue #134 review: idle 桶颜色按 order 判定（不再用正则）
describe('buildSandboxIdleOption - bucket colors by order', () => {
  it('colors buckets correctly: order 1-2 blue, 3-4 orange, 5+ red', () => {
    const buckets = [
      { label: 'lt_24h', order: 1, count: 5 },
      { label: '24h_48h', order: 2, count: 3 },
      { label: '48h_72h', order: 3, count: 2 },
      { label: '3d_7d', order: 4, count: 1 },
      { label: '7d_14d', order: 5, count: 10 },
      { label: '14d_30d', order: 6, count: 20 },
    ]
    const opt = buildSandboxIdleOption(buckets)
    const colors = (opt.series as any[])[0].data.map((d: any) => d.itemStyle.color)
    expect(colors[0]).toBe('#5B8EFF') // lt_24h → blue
    expect(colors[1]).toBe('#5B8EFF') // 24h_48h → blue
    expect(colors[2]).toBe('#FAAD14') // 48h_72h → orange
    expect(colors[3]).toBe('#FAAD14') // 3d_7d → orange
    expect(colors[4]).toBe('#FF4D4F') // 7d_14d → red
    expect(colors[5]).toBe('#FF4D4F') // 14d_30d → red
  })
  it('handles missing order gracefully (defaults to red)', () => {
    const buckets = [{ label: 'unknown', order: undefined, count: 1 }]
    const opt = buildSandboxIdleOption(buckets)
    const colors = (opt.series as any[])[0].data.map((d: any) => d.itemStyle.color)
    expect(colors[0]).toBe('#FF4D4F') // missing order → red (safe default)
  })
})
