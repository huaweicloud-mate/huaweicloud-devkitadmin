# Issue #30 方案设计

## 关键设计决策（方案评估留档）

| 决策 | 选项 | 选择 | 理由 |
|------|------|------|------|
| 实时数据获取方式 | A 实时直查聚合 / B 定时预计算+缓存 / C 前端高频轮询 | **B 为主，A 兜底** | B：5 分钟定时任务预计算当天指标写入当日聚合表，响应稳定；A：缓存过期（>2×间隔未成功）时 ensureFresh() 同步计算兜底；C 放大前端与接口压力，弃用 |
| 口径参数形式 | 独立实时接口 vs 现有接口加参数 | 现有接口加 `dateRange=yesterday\|realtime` | 与 T-1 并存、按参数区分，避免接口分裂 |
| 实时响应结构 | 改各 DTO 加字段 vs 包装 | `RealtimePayload{dateRange, computedAt, data}` 包装（仅实时口径） | T-1 响应结构零变化，向后兼容 |
| 定时任务间隔 | 固定 vs 可配置 | `DASHBOARD_REALTIME_INTERVAL_MINUTES`（默认 5）`@Scheduled(timeUnit=MINUTES)` | 需求默认 5 分钟，配置化可调优 |
| 数据时点语义 | 当前时刻 vs 截至上次计算 | 缓存截止上次计算（≤5 分钟延迟），响应带 computedAt | 指标稳定可复现，前端标注数据时点 |

## 实现路径

### 前端（主仓库 develop ← feat/issue-30）
1. `src/api/dashboard.ts`：口径相关接口加可选 `dateRange` 参数
2. `src/store/dashboard.ts`：`dateRange`/`computedAt`/`realtimeError` 状态；`unwrapRealtime` 解包；`setDateRange` 切换并重载；实时失败降级提示
3. `src/pages/dashboard/index.vue`：顶栏「前一天 / 当天实时」切换控件、实时计算时间戳展示、「昨日/当天」措辞联动

### 后端（hdkitservice dev ← feat/issue-30）
1. `DashboardConfig`：realtimeAggregationEnabled / realtimeIntervalMinutes 配置
2. `RealtimeAggregationTask`：5 分钟（可配置）定时聚合当天四族指标；`ensureFresh()` 同步兜底
3. `RealtimeMetricsCache`：lastComputedAt / lastStatus / executionCount / lastError 等观测状态
4. `DashboardService`：各 getter 增加 statDate 参数化重载（T-1 兼容无参重载保留）+ `aggregateAllForDate`
5. `DashboardController`：`dateRange` 参数 → 实时口径包装返回 + `GET /realtime/status` 观测端点
6. `application.yml`：realtime 配置项留档

## 测试
- 后端：`RealtimeAggregationTaskTest`（聚合/禁用/失败记录/过期判断/ensureFresh 跳过）、`DashboardControllerTest` 新增实时口径包装与 status 端点用例（本地无 JDK17/21 构建 环境，由 CI/QA 阶段执行）
- 前端：`vue-tsc --noEmit` 与 `vite build` 通过
