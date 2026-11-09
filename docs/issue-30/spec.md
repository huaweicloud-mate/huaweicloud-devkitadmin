# Issue #30 需求文档：运营看板增加实时数据查看

> 权威 Spec 已由 Issue Agent 发布于 Issue #30 评论（Developability: ready），本文为开发侧留档摘要。目标分支：`develop`。

## 目标
开发者运营看板支持「前一天（T-1）/ 当天实时」两种数据口径切换（默认前一天）；选择实时后 KPI 卡与趋势/占比图表展示当天数据；hdkitservice 配套提供实时口径接口与实时计算定时任务（默认 5 分钟、可配置、可观测）。

## 验收标准（摘自 Spec）
- [x] 看板可切换两种口径，默认前一天
- [x] 实时口径下 KPI 卡与图表数据来自当天，响应含数据计算时间戳 computedAt
- [x] hdkitservice 现有接口支持 dateRange=realtime|yesterday 参数（与 T-1 并存）
- [x] 实时计算定时任务：默认 5 分钟、间隔可配置（DASHBOARD_REALTIME_INTERVAL_MINUTES）、有执行日志与 /realtime/status 状态观测
- [x] 方案评估结论留档（见 plan.md「关键设计决策」）
- [x] 新增测试：RealtimeAggregationTaskTest、DashboardControllerTest 实时口径用例；前端 vue-tsc + vite build 通过

## 范围
- 主仓库（前端）：口径切换控件、API 参数化、store 解包与降级提示
- 关联仓库 hdkitservice（后端）：dateRange 参数、RealtimeAggregationTask 定时任务、RealtimeMetricsCache、/realtime/status
- 不含：WebSocket 推送、任意历史日期区间查询、开源运营板块（GitHub 外部数据，维持 T-1）
